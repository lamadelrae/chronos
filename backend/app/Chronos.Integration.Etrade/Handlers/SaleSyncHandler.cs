using Chronos.Integration.Etrade.Data.Etrade;
using Chronos.Integration.Etrade.Data.Integration;
using Chronos.Integration.Etrade.Models.Etrade;
using Chronos.Integration.Etrade.Models.Integration;
using Chronos.Integration.Etrade.Services;
using Chronos.Integration.Etrade.Shared.Extensions;
using Microsoft.EntityFrameworkCore;

namespace Chronos.Integration.Etrade.Handlers;

public interface ISaleSyncHandler
{
    Task Handle();
}

public class SaleSyncHandler(
    IChronosSaleService saleService,
    IConfiguration config,
    EtradeContext etradeContext,
    IntegrationContext integrationContext) : ISaleSyncHandler
{
    private readonly Guid CompanyId = config.GetValue<Guid>("Chronos:CompanyId");

    public async Task Handle()
    {
        var toSync = (await GetAllSalesAsync()).ToBatchesOf(1000);
        var syncedProducts = await GetAllSyncedProducts();

        foreach (var batch in toSync)
        {
            var ids = batch.Select(sale => sale.Id);
            var syncedSales = await integrationContext
                .Set<SyncedSale>()
                .Where(synced => ids.Contains(synced.EtradeId))
                .ToListAsync();

            var toCreate = ToCreate(syncedSales, batch);
            var toUpdate = ToUpdate(syncedSales, batch);

            foreach (var sale in toCreate)
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
                        ChronosId = chronosId.Value,
                        EtradeId = sale.Id,
                        LastUpdate = DateTime.Now
                    });

                await integrationContext.SaveChangesAsync();
            }

            foreach (var kvp in toUpdate)
            {
                var synced = kvp.Key;
                var sale = kvp.Value;

                var request = new IChronosSaleService.UpdateSaleRequest(synced.ChronosId, sale.Date, sale.Total,
                    sale.Items.Select(item => new IChronosSaleService.UpdateSaleRequest.SaleItem(syncedProducts[item.ProductId], item.Quantity, item.Price, item.Total)));

                await saleService.Put(request);
                synced.LastUpdate = DateTime.Now;

                integrationContext.Set<SyncedSale>()
                    .Update(synced);

                await integrationContext.SaveChangesAsync();
            }
        }
    }

    private async Task<Dictionary<Guid, Guid>> GetAllSyncedProducts()
    {
        var products = await integrationContext.Set<SyncedProduct>().ToListAsync();
        return products.ToDictionary(product => product.EtradeId, product => product.ChronosId);
    }

    private static List<Sale> ToCreate(List<SyncedSale> synced, List<Sale> sales)
    {
        return sales.Where(sale => !synced.Any(synced => synced.EtradeId == sale.Id)).ToList();
    }

    private static List<KeyValuePair<SyncedSale, Sale>> ToUpdate(List<SyncedSale> synced, List<Sale> sales)
    {
        var response = new List<KeyValuePair<SyncedSale, Sale>>();
        var outdatedSynced = synced.Where(sale => sale.LastUpdate < DateTime.Now.AddDays(-1));

        foreach (var outdated in outdatedSynced)
        {
            var match = sales.FirstOrDefault(sale => sale.Id == outdated.EtradeId);
            if (match != null)
            {
                response.Add(new KeyValuePair<SyncedSale, Sale>(outdated, match));
            }
        }

        return response;
    }

    private async Task<List<Sale>> GetAllSalesAsync()
    {
        var sql = @"
            SELECT 
            	Movimento.Ide AS [SaleId],
            	Efetivado_Data AS [SaleDate],
            	Total_Final as [SaleTotal],
            	Produto__Ide AS [SaleItemProductId],
            	Qtde AS [SaleItemQuantity],
            	Valor_Unit AS [SaleItemPrice],
            	Valor_Total [SaleItemTotal]
            FROM Movimento
            	JOIN  Movimento_Produto ON Movimento.Ide = Movimento_Produto.Movimento__Ide
            WHERE Tipo_Operacao = 'VND' AND Efetivado = 1
            ORDER BY Efetivado_Data";

        var sales = await etradeContext.Database.SqlQueryRaw<dynamic>(sql).ToListAsync();
        return sales.GroupBy(sale => new { sale.SaleId, sale.SaleDate, sale.SaleTotal })
            .Select(group => new Sale
            {
                Id = group.Key.SaleId,
                Date = group.Key.SaleDate,
                Total = group.Key.SaleTotal,
                Items = group.Select(sale => new SaleItem
                {
                    ProductId = sale.SaleItemProductId,
                    Quantity = sale.SaleItemQuantity,
                    Price = sale.SaleItemPrice,
                    Total = sale.SaleItemTotal
                }).ToList()
            }).ToList();
    }
}
