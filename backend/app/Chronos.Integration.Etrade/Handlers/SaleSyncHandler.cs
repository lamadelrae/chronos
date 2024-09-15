using Chronos.Integration.Etrade.Data.Etrade;
using Chronos.Integration.Etrade.Data.Integration;
using Chronos.Integration.Etrade.Models.Etrade;
using Chronos.Integration.Etrade.Models.Integration;
using Chronos.Integration.Etrade.Services;
using Chronos.Integration.Etrade.Shared.Extensions;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace Chronos.Integration.Etrade.Handlers;

public interface ISaleSyncHandler
{
    Task Handle();
}

public class SaleSyncHandler(
    ILastSyncService lastSyncService,
    IChronosSaleService saleService,
    IConfiguration config,
    IServiceScopeFactory scopeFactory) : ISaleSyncHandler
{
    private readonly Guid CompanyId = config.GetValue<Guid>("Chronos:CompanyId");

    public async Task Handle()
    {
        var semaphore = new SemaphoreSlim(10);
        var toSync = (await GetAllSalesAsync(await lastSyncService.Get())).ToBatchesOf(1000);
        var syncedProducts = await GetAllSyncedProducts();

        foreach (var batch in toSync)
        {
            await semaphore.WaitAsync();

            _ = Task.Run(async () =>
            {
                try
                {
                    await ProcessBatch(syncedProducts, batch);
                }
                finally
                {
                    semaphore.Release();
                }
            });
        }
    }
        
    private async Task<IEnumerable<Sale>> GetAllSalesAsync(DateTime lastSync)
    {
        var scope = scopeFactory.CreateScope();
        using var etradeContext = scope.ServiceProvider.GetRequiredService<EtradeContext>();

        var sql = @"
            SELECT 
            	Movimento.Ide AS [SaleId],
            	Data AS [SaleDate],
            	Total_Final as [SaleTotal],
            	Produto__Ide AS [SaleItemProductId],
            	Qtde AS [SaleItemQuantity],
            	Valor_Unit AS [SaleItemPrice],
            	Valor_Total [SaleItemTotal]
            FROM Movimento
            	JOIN  Movimento_Produto ON Movimento.Ide = Movimento_Produto.Movimento__Ide
            WHERE Tipo_Operacao = 'VND' AND Movimento_Produto.Tipo = 'S' AND Efetivado = 1 AND Data >= @lastSync
            ORDER BY Data";

        return (await etradeContext.Database.SqlQueryRaw<Sale.DataRecord>(sql, new SqlParameter("lastSync", lastSync)).ToListAsync())
            .GroupBy(item => new { item.SaleId, item.SaleDate, item.SaleTotal })
            .Select(group => new Sale(group.Key.SaleId, group.Key.SaleDate, group.Key.SaleTotal, group.Select(record => new Sale.Item(record.SaleItemProductId, record.SaleItemQuantity, record.SaleItemPrice, record.SaleItemTotal)).ToList()))
            .ToList();
    }

    private async Task ProcessBatch(Dictionary<Guid, Guid> syncedProducts, List<Sale> sales)
    {
        var scope = scopeFactory.CreateScope();
        using var integrationContext = scope.ServiceProvider.GetRequiredService<IntegrationContext>();

        var ids = sales.Select(sale => sale.Id);
        var syncedSales = (await integrationContext
            .Set<SyncedSale>()
            .Where(synced => ids.Contains(synced.Id))
            .ToListAsync());

        await CreateAll(integrationContext, syncedProducts, ToCreate(syncedSales, sales));
    }

    private async Task<Dictionary<Guid, Guid>> GetAllSyncedProducts()
    {
        var scope = scopeFactory.CreateScope();
        using var integrationContext = scope.ServiceProvider.GetRequiredService<IntegrationContext>();

        var products = await integrationContext.Set<SyncedProduct>().ToListAsync();
        return products.ToDictionary(product => product.EtradeId, product => product.ChronosId);
    }

    private static IEnumerable<Sale> ToCreate(IEnumerable<SyncedSale> synced, List<Sale> sales)
    {
        return sales.Where(sale => !synced.Any(synced => synced.Id == sale.Id));
    }

    private async Task CreateAll(IntegrationContext integrationContext, Dictionary<Guid, Guid> syncedProducts, IEnumerable<Sale> sales)
    {
        foreach (var sale in sales)
        {
            try
            {
                var request = new IChronosSaleService.CreateSaleRequest(CompanyId, sale.Date, sale.Total,
                    sale.Items.Select(item => new IChronosSaleService.CreateSaleRequest.SaleItem(syncedProducts[item.ProductId], item.Quantity, item.Price, item.Total)));

                var chronosId = (await saleService.Post(request))?.Id;
                if (chronosId == null)
                {
                    continue;
                }

                await integrationContext.Set<SyncedSale>()
                    .AddAsync(new SyncedSale
                    {
                        Id = sale.Id,
                    });

                await integrationContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                continue;
            }
        }
    }
}
