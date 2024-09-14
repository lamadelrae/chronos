using Chronos.Api.Data;
using Chronos.Api.Entities.DataRecords;
using Chronos.Api.Shared.Users;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace Chronos.Api.Handlers.Metrics;

public interface IFetchMetricsHandler
{
    Task<Response> Handle();

    public record Response(Response.MonthStat Current, Response.MonthStat Last)
    {
        public record MonthStat(int Year, int Month, int SaleQuantity, decimal Total, decimal AverageTicket, decimal ProductQuantitySold, decimal AverageSellingPrice, IEnumerable<DayStat> Days);
        public record DayStat(DateOnly Date, int SaleQuantity, decimal Total, decimal AverageTicket, decimal ProductQuantitySold, decimal AverageSellingPrice);
    }
}
public class FetchMetricsHandler(Context context, IUserInfo userInfo) : IFetchMetricsHandler
{
    public async Task<IFetchMetricsHandler.Response> Handle()
    {
        var data = await Fetch();

        var groups = data.GroupBy(x => new { x.Date.Year, x.Date.Month }).Take(2);

        var months = groups
            .OrderByDescending(x => x.Key.Year)
            .ThenByDescending(x => x.Key.Month)
            .Select(x => new IFetchMetricsHandler.Response.MonthStat(
                x.Key.Year,
                x.Key.Month,
                x.Sum(y => y.SaleQuantity),
                x.Sum(y => y.Total),
                x.Sum(y => y.Total) / x.Sum(y => y.SaleQuantity),
                x.Sum(y => y.ProductQuantitySold),
                x.Sum(y => y.Total) / x.Sum(y => y.ProductQuantitySold),
                x.Select(y => new IFetchMetricsHandler.Response.DayStat(y.Date, y.SaleQuantity, y.Total, y.AverageTicket, y.ProductQuantitySold, y.AverageSellingPrice))
            ));

        return new IFetchMetricsHandler.Response(months.First(), months.Last());
    }

    public async Task<IEnumerable<DailySaleStatistic>> Fetch()
    {
        var sql = @"
                DECLARE @LastSaleDate DATE;
                
                DECLARE @LastMonthFirstDayByLastSaleDate DATE;
                
                SET
                    @LastSaleDate = (
                        SELECT
                            TOP 1 Date
                        FROM
                            Sale
                        WHERE CompanyId = @companyId
                        ORDER BY
                            Date DESC
                    )
                SET
                    @LastMonthFirstDayByLastSaleDate = CAST(
                        DATEADD(
                            month,
                            DATEDIFF(month, 0, DATEADD(MONTH, -1, @LastSaleDate)),
                            0
                        ) AS DATE
                    );
                
                SELECT
                    CAST(Sale.Date AS DATE) Date,
                    COUNT(DISTINCT Sale.Id) SaleQuantity,
	                SUM(DISTINCT Sale.Total) Total,
	                (SUM(DISTINCT Sale.Total) / COUNT(DISTINCT Sale.Id)) AverageTicket,
					SUM(SaleItem.Quantity) ProductQuantitySold,
					SUM(DISTINCT Sale.Total) / SUM(SaleItem.Quantity) AverageSellingPrice
                FROM
                    Sale
                JOIN SaleItem ON Sale.Id = SaleItem.SaleId
                WHERE
                    Sale.CompanyId = @companyId AND
                    CAST(Sale.Date AS DATE) >= @LastMonthFirstDayByLastSaleDate
                    AND CAST(Sale.Date AS DATE) <= @LastSaleDate
                GROUP BY
                    CAST(Sale.Date AS DATE)
                ORDER BY
                    CAST(Sale.Date AS DATE)";

        return await context.Database.SqlQueryRaw<DailySaleStatistic>(sql, new SqlParameter("companyId", userInfo.CompanyId)).ToListAsync();
    }
}
