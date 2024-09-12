using Chronos.Api.Data;
using Chronos.Api.Shared.Responses;
using Chronos.Api.Shared.Users;
using Microsoft.EntityFrameworkCore;

namespace Chronos.Api.Handlers.Sale;

public interface IFetchSalesHandler
{
    Task<PaginatedResponse<Response>> Handle(Request request);

    public record Request(int Page, int PageSize);
    public record Response(Guid Id, DateTime Date, decimal Total, IEnumerable<Response.Item> Items)
    {
        public record Item(Guid ProductId, string Name, decimal Price, decimal Quantity);
    };
}

public class FetchSalesHandler(Context context, IUserInfo userInfo) : IFetchSalesHandler
{
    public async Task<PaginatedResponse<IFetchSalesHandler.Response>> Handle(IFetchSalesHandler.Request request)
    {
        var sales = await context.Set<Entities.Sale>()
            .Include(sale => sale.Items)
                    .ThenInclude(item => item.Product)
            .Skip(request.PageSize * request.Page)
            .Take(request.PageSize)
            .Where(sale => sale.CompanyId == userInfo.CompanyId)
            .Select(sale => new IFetchSalesHandler.Response(sale.Id, sale.Date, sale.Total, sale.Items.Select(item => new IFetchSalesHandler.Response.Item(item.ProductId, item.Product.Name, item.Price, item.Quantity))))
            .ToListAsync();

        var count = await context.Set<Entities.Sale>().CountAsync();

        return new PaginatedResponse<IFetchSalesHandler.Response>(request.Page, request.PageSize)
            .SetData(sales)
            .SetTotalItems(count);
    }
}
