using Chronos.Integration.Etrade.Data.Etrade;
using Chronos.Integration.Etrade.Data.Integration;
using Chronos.Integration.Etrade.Models.Etrade;
using Chronos.Integration.Etrade.Models.Integration;
using Chronos.Integration.Etrade.Services;
using Chronos.Integration.Etrade.Shared.Extensions;
using Microsoft.EntityFrameworkCore;

namespace Chronos.Integration.Etrade.Handlers;

public interface IProductSyncHandler
{
    Task Handle();
}

public class ProductSyncHandler(
    IChronosProductService service,
    IConfiguration config,
    IServiceScopeFactory scopeFactory) : IProductSyncHandler
{
    private readonly Guid CompanyId = config.GetValue<Guid>("Chronos:CompanyId");

    public async Task Handle()
    {
        var semaphore = new SemaphoreSlim(5);
        var toSync = (await GetAllProducts()).ToBatchesOf(1000);

        foreach (var batch in toSync)
        {
            await semaphore.WaitAsync();

            _ = Task.Run(async () =>
            {
                try
                {
                    await ProcessBatch(batch);
                }
                finally
                {
                    semaphore.Release();
                }
            });
        }
    }

    private async Task<IEnumerable<Product>> GetAllProducts()
    {
        var scope = scopeFactory.CreateScope();
        using var etradeContext = scope.ServiceProvider.GetRequiredService<EtradeContext>();

        var sql = @"
	        SELECT 
	        	P.Ide AS Id,
	        	P.Nome AS Name,
	        	PP.Preco as Price
	        FROM Produto P
	        	JOIN ProdutoPreco PP ON P.Ide = PP.Produto__Ide
	        	JOIN TabelaPreco TP ON PP.TabelaPreco__Ide = TP.Ide
	        WHERE TP.Custo = 0
	        ORDER BY P.Id";

        return await etradeContext.Database.SqlQueryRaw<Product>(sql).ToListAsync();
    }

    private async Task ProcessBatch(List<Product> products)
    {
        var scope = scopeFactory.CreateScope();
        using var integrationContext = scope.ServiceProvider.GetRequiredService<IntegrationContext>();

        var ids = products.Select(product => product.Id);
        var syncedProducts = await integrationContext
            .Set<SyncedProduct>()
            .Where(synced => ids.Contains(synced.EtradeId))
            .ToListAsync();

        await CreateAll(integrationContext, ToCreate(syncedProducts, products));
        await UpdateAll(integrationContext, ToUpdate(syncedProducts, products));
    }

    private static IEnumerable<Product> ToCreate(IEnumerable<SyncedProduct> synced, IEnumerable<Product> products)
    {
        return products.Where(product => !synced.Any(synced => synced.EtradeId == product.Id));
    }

    public async Task CreateAll(IntegrationContext integrationContext, IEnumerable<Product> products)
    {
        foreach (var product in products)
        {
            try
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
            catch (Exception)
            {
                continue;
            }
        }
    }

    private static IEnumerable<KeyValuePair<SyncedProduct, Product>> ToUpdate(IEnumerable<SyncedProduct> synced, IEnumerable<Product> products)
    {
        var response = new List<KeyValuePair<SyncedProduct, Product>>();
        var outdatedSynced = synced.Where(product => product.LastUpdate < DateTime.Now.AddDays(-5));

        foreach (var outdated in outdatedSynced)
        {
            var match = products.FirstOrDefault(product => product.Id == outdated.EtradeId);
            if (match != null)
            {
                response.Add(new KeyValuePair<SyncedProduct, Product>(outdated, match));
            }
        }

        return response.AsEnumerable();
    }

    public async Task UpdateAll(IntegrationContext integrationContext, IEnumerable<KeyValuePair<SyncedProduct, Product>> products)
    {
        foreach (var kvp in products)
        {
            try
            {
                var synced = kvp.Key;
                var product = kvp.Value;

                var success = await service.Put(new IChronosProductService.UpdateProduct(synced.ChronosId, product.Name, product.Price));
                if (!success)
                {
                    continue;
                }

                synced.LastUpdate = DateTime.Now;
                integrationContext.Set<SyncedProduct>()
                   .Update(synced);

                await integrationContext.SaveChangesAsync();
            }
            catch (Exception)
            {
                continue;
            }
        }
    }
}
