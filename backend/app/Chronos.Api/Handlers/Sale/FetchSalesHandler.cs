using Chronos.Api.Data;
using Chronos.Api.Shared.Responses;
using Chronos.Api.Shared.Users;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

namespace Chronos.Api.Handlers.Sale;

public interface IFetchSalesHandler
{
    Task<PaginatedResponse<Response>> Handle(Request request);

    public record Request(int Page, int PageSize, DateTime? Start, DateTime? End, SortBy? SortBy, bool Ascending);

    public record Response(Guid Id, DateTime Date, decimal Total, IEnumerable<Response.Item> Items)
    {
        public record Item(Guid ProductId, string Name, decimal Price, decimal Quantity);
    };

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum SortBy { Date, Total }
}

public class FetchSalesHandler(Context context, IUserInfo userInfo) : IFetchSalesHandler
{
    public async Task<PaginatedResponse<IFetchSalesHandler.Response>> Handle(IFetchSalesHandler.Request request)
    {
        var query = BuildQuery(request);

        var sales = await query
            .Skip(request.PageSize * request.Page).Take(request.PageSize)
            .Select(sale => new IFetchSalesHandler.Response(sale.Id, sale.Date, sale.Total, sale.Items.Select(item => new IFetchSalesHandler.Response.Item(item.ProductId, item.Product.Name, item.Price, item.Quantity))))
            .ToListAsync();

        var count = await query.CountAsync();

        return new PaginatedResponse<IFetchSalesHandler.Response>(request.Page, request.PageSize)
            .SetData(sales)
            .SetTotalItems(count);
    }

    private IQueryable<Entities.Sale> BuildQuery(IFetchSalesHandler.Request request)
    {
        var query = context.Set<Entities.Sale>()
            .Include(sale => sale.Items)
                .ThenInclude(item => item.Product)
            .Where(sale => sale.CompanyId == userInfo.CompanyId);

        if (request.Start.HasValue)
        {
            query = query.Where(sale => sale.Date >= request.Start);
        }

        if (request.End.HasValue)
        {
            query = query.Where(sale => sale.Date <= request.End);
        }

        if (request.SortBy == IFetchSalesHandler.SortBy.Date)
        {
            query = request.Ascending
                ? query.OrderBy(sale => sale.Date)
                : query.OrderByDescending(sale => sale.Date);
        }
        else if (request.SortBy == IFetchSalesHandler.SortBy.Total)
        {
            query = request.Ascending
                ? query.OrderBy(sale => sale.Total)
                : query.OrderByDescending(sale => sale.Total);
        }

        return query;
    }
}
