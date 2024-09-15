using Chronos.Api.Data;
using Chronos.Api.Entities.DataRecords;
using Chronos.Api.Shared.Users;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace Chronos.Api.Handlers.Metrics;

public interface IFetchMetricsHandler
{
    Task<Response> Handle(DateOnly date);

    public record Response(Response.MonthStat Current, Response.MonthStat Last)
    {
        public record MonthStat(int Year, int Month, int SaleQuantity, decimal Total, decimal AverageTicket, decimal ProductQuantitySold, decimal AverageSellingPrice, IEnumerable<DayStat> Days);
        public record DayStat(DateOnly Date, int SaleQuantity, decimal Total, decimal AverageTicket, decimal ProductQuantitySold, decimal AverageSellingPrice);
    }
}

public class FetchMetricsHandler(Context context, IUserInfo userInfo) : IFetchMetricsHandler
{
    public async Task<IFetchMetricsHandler.Response> Handle(DateOnly date)
    {
        var data = await Fetch(date);

        var groups = data.GroupBy(x => new { x.Date.Year, x.Date.Month }).Take(2);

        var months = groups
            .OrderByDescending(x => x.Key.Year)
            .ThenByDescending(x => x.Key.Month)
            .Select(x => new IFetchMetricsHandler.Response.MonthStat(
                x.Key.Year,
                x.Key.Month,
                x.Sum(y => y.Quantity),
                x.Sum(y => y.Total),
                x.Sum(y => y.Total) / x.Sum(y => y.Quantity),
                x.Sum(y => y.ProductQuantitySold),
                x.Sum(y => y.Total) / x.Sum(y => y.ProductQuantitySold),
                x.Select(y => new IFetchMetricsHandler.Response.DayStat(y.Date, y.Quantity, y.Total, y.AverageTicket, y.ProductQuantitySold, y.AverageSellingPrice))
            ));

        return new IFetchMetricsHandler.Response(months.First(), months.Last());
    }

    public async Task<IEnumerable<DailySaleStatistic>> Fetch(DateOnly date)
    {
        var start = new DateOnly(date.Year, date.Month, 1).AddMonths(-1);

        var sql = @"
               
                WITH SaleSummary AS (
                    SELECT
                        CAST(Sale.Date AS DATE) AS Date,
                        COUNT(DISTINCT Sale.Id) AS Quantity,
                        SUM(Sale.Total) AS Total,
                        SUM(Sale.Total) / COUNT(DISTINCT Sale.Id) AS AverageTicket
                    FROM
                        Sale
                    WHERE
                        Sale.CompanyId = @companyId
                        AND CAST(Sale.Date AS DATE) >= @start
                        AND CAST(Sale.Date AS DATE) <= @end
                    GROUP BY
                        CAST(Sale.Date AS DATE)
                ),
                SaleItemSummary AS (
                    SELECT
                        CAST(Sale.Date AS DATE) AS Date,
                        SUM(SaleItem.Quantity) AS ProductQuantitySold
                    FROM
                        SaleItem
                        JOIN Sale ON SaleItem.SaleId = Sale.Id
                    WHERE
                        Sale.CompanyId = @companyId
                        AND CAST(Sale.Date AS DATE) >= @start
                        AND CAST(Sale.Date AS DATE) <= @end
                    GROUP BY
                        CAST(Sale.Date AS DATE)
                ) 
                SELECT
                    ss.Date,
                    ss.Quantity,
                    ss.Total,
                    ss.AverageTicket,
                    sis.ProductQuantitySold,
                    ss.Total / sis.ProductQuantitySold AverageSellingPrice
                FROM
                    SaleSummary ss
                    JOIN SaleItemSummary sis ON ss.Date = sis.Date
                ORDER BY
                    ss.Date;";

        return await context.Database.SqlQueryRaw<DailySaleStatistic>(sql,
            new SqlParameter("companyId", userInfo.CompanyId),
            new SqlParameter("start", start),
            new SqlParameter("end", date)).ToListAsync();
    }
}
