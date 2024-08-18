using Chronos.Integration.Etrade.Data.Etrade;
using Chronos.Integration.Etrade.Data.Integration;
using Chronos.Integration.Etrade.Models.Etrade;
using Chronos.Integration.Etrade.Models.Integration;
using Chronos.Integration.Etrade.Services;
using Chronos.Integration.Etrade.Shared.Extensions;
using Microsoft.EntityFrameworkCore;
using System.Runtime.CompilerServices;

namespace Chronos.Integration.Etrade.Handlers;

public interface IProductSyncHandler
{
    Task Handle();
}

public class ProductSyncHandler(
    IChronosProductService service,
    IConfiguration config,
    EtradeContext etradeContext,
    IntegrationContext integrationContext) : IProductSyncHandler
{
    private readonly Guid CompanyId = config.GetValue<Guid>("Chronos:CompanyId");

    public async Task Handle()
    {
        var toSync = (await GetAllProducts()).ToBatchesOf(1000);

        foreach (var batch in toSync)
        {
            var ids = batch.Select(product => product.Id);
            var syncedProducts = await integrationContext
                .Set<SyncedProduct>()
                .Where(synced => ids.Contains(synced.EtradeId))
                .ToListAsync();

            var toCreate = ToCreate(syncedProducts, batch);
            var toUpdate = ToUpdate(syncedProducts, batch);

            foreach (var product in toCreate)
            {
                var chronosId = (await service.Post(new IChronosProductService.CreateProductRequest(CompanyId, product.Name, product.Price)))?.Id;
                if (chronosId == null)
                {
                    continue;
                }

                await integrationContext.Set<SyncedProduct>()
                    .AddAsync(new SyncedProduct
                    {
                        ChronosId = chronosId.Value,
                        EtradeId = product.Id,
                        LastUpdate = DateTime.Now
                    });

                await integrationContext.SaveChangesAsync();
            }

            foreach (var kvp in toUpdate)
            {
                var synced = kvp.Key;
                var product = kvp.Value;

                var success = await service.Put(new IChronosProductService.UpdateProduct(product.Id, product.Name, product.Price));
                if (!success)
                {
                    continue;
                }

                synced.LastUpdate = DateTime.Now;
                integrationContext.Set<SyncedProduct>()
                   .Update(synced);

                await integrationContext.SaveChangesAsync();
            }
        }
    }

    private async Task<List<Product>> GetAllProducts()
    {
        var sql = @"
	        SELECT 
	        	P.Ide AS Id,
	        	P.Nome AS Name,
	        	PP.Preco as Price
	        FROM Produto P
	        	JOIN ProdutoPreco PP ON P.Ide = PP.Produto__Ide
	        	JOIN TabelaPreco TP ON PP.TabelaPreco__Ide = TP.Ide
	        WHERE TP.Custo = 0 AND P.Inativo = 0
	        ORDER BY P.Id";

        return await etradeContext.Database.SqlQuery<Product>(FormattableStringFactory.Create(sql)).ToListAsync();
    }

    private static List<Product> ToCreate(List<SyncedProduct> synced, List<Product> products)
    {
        return products.Where(product => !synced.Any(synced => synced.EtradeId == product.Id)).ToList();
    }

    private static List<KeyValuePair<SyncedProduct, Product>> ToUpdate(List<SyncedProduct> synced, List<Product> products)
    {
        var response = new List<KeyValuePair<SyncedProduct, Product>>();
        var outdatedSynced = synced.Where(product => product.LastUpdate < DateTime.Now.AddDays(-1));
        foreach (var outdated in outdatedSynced)
        {
            var match = products.FirstOrDefault(product => product.Id == outdated.EtradeId);
            if (match != null)
            {
                response.Add(new KeyValuePair<SyncedProduct, Product>(outdated, match));
            }
        }

        return response;
    }
}
