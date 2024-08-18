using Chronos.Integration.Etrade.Data.Etrade;
using Chronos.Integration.Etrade.Data.Integration;
using Chronos.Integration.Etrade.Models.Etrade;
using Microsoft.EntityFrameworkCore;
using System.Runtime.CompilerServices;

namespace Chronos.Integration.Etrade.Handlers;

public interface IProductSyncHandler
{
    Task Handle();
}

public class ProductSyncHandler(EtradeContext etradeContext, IntegrationContext integrationContext) : IProductSyncHandler
{
    public async Task Handle()
    {
        var products = await GetProductsToSync();
    }

    private async Task<List<Product>> GetProductsToSync()
    {
        var sql = @"
            SELECT 
            	P.Ide AS Id,
            	P.Nome AS Name,
            	PP.Preco as Price
            FROM Produto P
            	JOIN ProdutoPreco PP ON P.Ide = PP.Produto__Ide
            	JOIN TabelaPreco TP ON PP.TabelaPreco__Ide = TP.Ide
            WHERE TP.Custo = 0";

        return await etradeContext.Database.SqlQuery<Product>(FormattableStringFactory.Create(sql)).ToListAsync();
    }
}
