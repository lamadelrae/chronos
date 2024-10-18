using Chronos.Api.Data;
using Chronos.Api.Entities;
using Chronos.Api.Entities.DataRecords;
using Chronos.Api.Services;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Quartz;

namespace Chronos.Api.Jobs;

public class PredictionJob(Context dbContext, IPredictionHttpService predictionService) : IJob
{
    public async Task Execute(IJobExecutionContext context)
    {
        var companies = await GetAllCompanies();

        foreach (var company in companies)
        {
            await ProcessCompany(company);
        }
    }

    private async Task<IEnumerable<Guid>> GetAllCompanies()
    {
        return await dbContext.Set<Company>().Select(p => p.Id).ToListAsync();
    }

    private async Task ProcessCompany(Guid companyId)
    {
        await DeleteOldPredictions(companyId);

        var stats = await GetProductStats(companyId);
        var groups = stats.GroupBy(stat => new { stat.Id, stat.Name });

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

    private async Task DeleteOldPredictions(Guid companyId)
    {
        var predictions = await dbContext.Set<Prediction>().Where(p => p.Product.CompanyId == companyId).ToListAsync();
        dbContext.Set<Prediction>().RemoveRange(predictions);
        await dbContext.SaveChangesAsync();
    }

    private async Task<IEnumerable<DailyProductStatistic>> GetProductStats(Guid companyId)
    {
        var sql = @"
                DECLARE @Min DATE =(
                	SELECT
                		MIN(CAST(Sale.Date AS DATE)) AS [Date]
                	FROM
                		Sale
                	WHERE Sale.CompanyId = @companyId
                );

                DECLARE @Max DATE = (
                	SELECT
                		MAX(CAST(Sale.Date AS DATE)) AS [Date]
                	FROM
                		Sale
                	WHERE Sale.CompanyId = @companyId
                );

                WITH DateSeries AS (
                	SELECT
                		@Min AS [Date]
                	UNION
                	ALL
                	SELECT
                		DATEADD(DAY, 1, [Date])
                	FROM
                		DateSeries
                	WHERE
                		[Date] < @Max
                ),
                MostSoldProductsInLastMonth AS (
                	SELECT
                		TOP 50 Product.Id,
                		Product.Name,
                		MAX(Sale.Date) LastSaleDate
                	FROM
                		Product
                		JOIN SaleItem ON SaleItem.ProductId = Product.Id
                		JOIN Sale ON Sale.Id = SaleItem.SaleId
                	WHERE
                		Product.CompanyId = @companyId AND Sale.Date >= DATEADD(DAY, -35, @Max)
                	GROUP BY
                		Product.Id,
                		Product.Name
                	ORDER BY
                		SUM(SaleItem.Quantity) DESC
                ),
                SaleByDay AS (
                	SELECT
                		Product.Id,
                		Product.Name,
                		CAST(Sale.Date AS DATE) [Date],
                		SUM(SaleItem.Quantity) Sales
                	FROM
                		Product
                		JOIN SaleItem ON Product.Id = SaleItem.ProductId
                		JOIN Sale ON Sale.Id = SaleItem.SaleId
                	WHERE Product.CompanyId = @companyId
                	GROUP BY
                		Product.Id,
                		Product.Name,
                		CAST(Sale.Date AS DATE)
                )
                SELECT
                	MostSoldProductsInLastMonth.Id,
                	MostSoldProductsInLastMonth.Name,
                	DateSeries.[Date],
                	ISNULL(SaleByDay.Sales, 0) AS Sales
                FROM
                	DateSeries
                	CROSS JOIN MostSoldProductsInLastMonth
                	LEFT JOIN SaleByDay ON DateSeries.[Date] = SaleByDay.[Date] AND MostSoldProductsInLastMonth.Id = SaleByDay.Id
                WHERE
                	DateSeries.[Date] BETWEEN DATEADD(
                		DAY,
                		-35,
                		MostSoldProductsInLastMonth.LastSaleDate
                	)
                	AND MostSoldProductsInLastMonth.LastSaleDate
                ORDER BY
                	MostSoldProductsInLastMonth.Name,
                	DateSeries.[Date] OPTION (MAXRECURSION 0);";

        return await dbContext.Database.SqlQueryRaw<DailyProductStatistic>(sql, new SqlParameter("companyId", companyId)).ToListAsync();
    }
}
