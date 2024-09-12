using Chronos.Api.Data;
using Chronos.Api.Entities;
using Chronos.Api.Entities.DataRecords;
using Chronos.Api.Services;
using Microsoft.EntityFrameworkCore;
using Quartz;

namespace Chronos.Api.Jobs;

public class PredictionJob(Context dbContext, IPredictionHttpService predictionService) : IJob
{
    public async Task Execute(IJobExecutionContext context)
    {
        var stats = await GetProductStats();

        var groups = stats.GroupBy(stat => new { stat.Id, stat.Name });
        await DeleteOldPredictions(groups.Select(group => group.Key.Id));

        foreach (var group in groups)
        {
            var request = new IPredictionHttpService.Request(
                group.Key.Name,
                group.Select(item => new IPredictionHttpService.Request.Sale(item.Date, item.Sales)));

            var prediction = await predictionService.Post(request);
            if (prediction is null)
            {
                continue;
            }

            var entity = new Prediction()
            {
                Id = Guid.NewGuid(),
                LastUpdate = DateTime.Now,
                CreatedAt = DateTime.Now,
                ProductId = group.Key.Id,
                Sales = prediction.Sales.Select(p => new PredictionSale()
                {
                    CreatedAt = DateTime.Now,
                    LastUpdate = DateTime.Now,
                    Date = p.Date,
                    Quantity = p.Quantity
                }).ToList()
            };

            await dbContext.Set<Prediction>().AddAsync(entity);
            await dbContext.SaveChangesAsync();
        }
    }

    private async Task DeleteOldPredictions(IEnumerable<Guid> products)
    {
        var predictions = await dbContext.Set<Prediction>().Where(p => products.Contains(p.ProductId)).ToListAsync();
        dbContext.Set<Prediction>().RemoveRange(predictions);
        await dbContext.SaveChangesAsync();
    }

    private async Task<IEnumerable<ProductStatistic>> GetProductStats()
    {
        var sql = @"
			WITH MostSoldProducts as (
				SELECT TOP 50 Product.Id, MAX(Sale.Date) LastSaleDate FROM Product
					JOIN SaleItem ON SaleItem.ProductId = Product.Id
					JOIN Sale ON Sale.Id = SaleItem.SaleId
				GROUP BY Product.Id
				ORDER BY COUNT(*) DESC
			),
			SaleByDay AS (
				SELECT Product.Id, Product.Name, CAST(Sale.Date AS DATE) [Date], COUNT(*) Sales
				FROM Product
					JOIN SaleItem ON Product.Id = SaleItem.ProductId
					JOIN Sale ON Sale.Id = SaleItem.SaleId
				GROUP BY Product.Id, Product.Name, CAST(Sale.Date AS DATE)
			)
			
			SELECT SaleByDay.Id, Name, Date, Sales FROM SaleByDay
				JOIN MostSoldProducts ON SaleByDay.Id = MostSoldProducts.Id
			WHERE 
				SaleByDay.Date >= DATEADD(day, -35,  MostSoldProducts.LastSaleDate) AND 
				SaleByDay.Date <= MostSoldProducts.LastSaleDate
			ORDER BY Name, [Date]";

        return await dbContext.Database.SqlQueryRaw<ProductStatistic>(sql).ToListAsync();
    }
}
