using Chronos.Api.Data;
using Chronos.Api.Shared.Responses;
using Microsoft.EntityFrameworkCore;

namespace Chronos.Api.Handlers.Sale;

public interface IFetchSalesHandler
{
    Task<PaginatedResponse<Response>> Handle(Request request);

    public record Request(int Page, int PageSize);
    public record Response(Guid Id, DateTime Date, decimal Total);
}

public class FetchSalesHandler(Context context) : IFetchSalesHandler
{
    public async Task<PaginatedResponse<IFetchSalesHandler.Response>> Handle(IFetchSalesHandler.Request request)
    {
        var sales = await context.Set<Entities.Sale>()
            .Skip(request.PageSize * request.Page)
            .Take(request.PageSize)
            .Select(x => new IFetchSalesHandler.Response(x.Id, x.Date, x.Total))
            .ToListAsync();

        var count = await context.Set<Entities.Sale>().CountAsync();

        return new PaginatedResponse<IFetchSalesHandler.Response>(request.Page, request.PageSize)
            .SetData(sales)
            .SetTotalItems(count);
    }
}
