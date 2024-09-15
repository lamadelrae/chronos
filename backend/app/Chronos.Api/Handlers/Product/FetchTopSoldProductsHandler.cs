using Chronos.Api.Data;
using Chronos.Api.Entities.DataRecords;
using Chronos.Api.Shared.Users;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace Chronos.Api.Handlers.Product;

public interface IFetchTopSoldProductsHandler
{
    Task<IEnumerable<Response>> Handle();

    public record Response(Guid Id, string Name, decimal Quantity, decimal Total);
}

public class FetchTopSoldProductsHandler(Context context, IUserInfo userInfo) : IFetchTopSoldProductsHandler
{
    public async Task<IEnumerable<IFetchTopSoldProductsHandler.Response>> Handle()
    {
        return (await GetProductStats())
            .Select(stat => new IFetchTopSoldProductsHandler.Response(stat.Id, stat.Name, stat.Quantity, stat.Total));
    }

    private async Task<IEnumerable<ProductSoldStatistic>> GetProductStats()
    {
        var sql = @"
                SELECT
                	TOP 50 
                    Product.Id,
                	Product.Name,
                	SUM(SaleItem.Quantity) Quantity,
                	SUM (SaleItem.Total) Total
                FROM
                	Product
                	JOIN SaleItem ON SaleItem.ProductId = Product.Id
                	JOIN Sale ON Sale.Id = SaleItem.SaleId
                WHERE Product.CompanyId = @companyId
                GROUP BY
                	Product.Id,
                	Product.Name
                ORDER BY
                	SUM(SaleItem.Quantity) DESC;";

        return await context.Database.SqlQueryRaw<ProductSoldStatistic>(sql, new SqlParameter("companyId", userInfo.CompanyId)).ToListAsync();
    }
}