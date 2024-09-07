using Chronos.Api.Data;
using Chronos.Api.Entities;
using Microsoft.EntityFrameworkCore;
using Quartz;

namespace Chronos.Api.Jobs;

public class PredictionJob(Context dbContext) : IJob
{
    public async Task Execute(IJobExecutionContext context)
    {
        var result = await dbContext.Set<Product>()
            .Join(dbContext.Set<SaleItem>(), product => product.Id, saleItem => saleItem.ProductId, (product, saleItem) => new { product, saleItem })
            .Join(dbContext.Set<Sale>(), ps => ps.saleItem.SaleId, sale => sale.Id, (ps, sale) => new { ps.product.Id, ps.product.Name, SaleDate = sale.Date })
            .GroupBy(x => new
            {
                x.Id,
                x.Name,
                x.SaleDate.Year,
                 x.SaleDate.Month
            })
            .Select(g => new
            {
                ProductId = g.Key.Id,
                ProductName = g.Key.Name,
                g.Key.Year,
                g.Key.Month,
                SaleCount = g.Count()
            })
            .OrderBy(x => x.ProductName)
            .ThenBy(x => x.Year)
            .ThenBy(x => x.Month)
            .ToListAsync();



    }
}
