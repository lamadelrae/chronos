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
    EtradeContext etradeContext,
    IntegrationContext integrationContext) : ISaleSyncHandler
{
    private readonly Guid CompanyId = config.GetValue<Guid>("Chronos:CompanyId");

    public async Task Handle()
    {
        var lastSync = await lastSyncService.Get();

        var toSync = (await GetAllSalesAsync(lastSync)).ToBatchesOf(1000);
        var syncedProducts = await GetAllSyncedProducts();

        foreach (var batch in toSync)
        {
            var ids = batch.Select(sale => sale.Id);
            var syncedSales = (await integrationContext
                .Set<SyncedSale>()
                .Where(synced => ids.Contains(synced.Id))
                .ToListAsync());

            await CreateAll(syncedProducts, ToCreate(syncedSales, batch));
        }
    }

    private async Task<IEnumerable<Sale>> GetAllSalesAsync(DateTime lastSync)
    {
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
            WHERE Tipo_Operacao = 'VND' AND Efetivado = 1 AND Data >= @lastSync
            ORDER BY Data";

        return (await etradeContext.Database.SqlQueryRaw<Sale.DataRecord>(sql, new SqlParameter("lastSync", lastSync)).ToListAsync())
            .GroupBy(item => new { item.SaleId, item.SaleDate, item.SaleTotal })
            .Select(group => new Sale(group.Key.SaleId, group.Key.SaleDate, group.Key.SaleTotal, group.Select(record => new Sale.Item(record.SaleItemProductId, record.SaleItemQuantity, record.SaleItemPrice, record.SaleItemTotal)).ToList()))
            .ToList();
    }

    private async Task<Dictionary<Guid, Guid>> GetAllSyncedProducts()
    {
        var products = await integrationContext.Set<SyncedProduct>().ToListAsync();
        return products.ToDictionary(product => product.EtradeId, product => product.ChronosId);
    }

    private static IEnumerable<Sale> ToCreate(IEnumerable<SyncedSale> synced, List<Sale> sales)
    {
        return sales.Where(sale => !synced.Any(synced => synced.Id == sale.Id));
    }

    private async Task CreateAll(Dictionary<Guid, Guid> syncedProducts, IEnumerable<Sale> sales)
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
            catch (Exception)
            {
                continue;
            }
        }
    }
}
