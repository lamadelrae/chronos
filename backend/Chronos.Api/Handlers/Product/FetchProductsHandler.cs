using Chronos.Api.Data;
using Chronos.Api.Shared.Responses;
using Microsoft.EntityFrameworkCore;

namespace Chronos.Api.Handlers.Product;

public interface IFetchProductsHandler 
{
    Task<PaginatedResponse<Response>> Handle(Request request);

    public record Request(int Page, int PageSize, Guid[]? Ids);
    public record Response(Guid Id, string Name, decimal Price);
}

public class FetchProductsHandler(Context context) : IFetchProductsHandler
{
    public async Task<PaginatedResponse<IFetchProductsHandler.Response>> Handle(IFetchProductsHandler.Request request)
    {
        var products = await context.Set<Entities.Product>()
            .Skip(request.PageSize * request.Page)
            .Take(request.PageSize)
            .Where(product => request.Ids == null || request.Ids.Contains(product.Id))
            .Select(x => new IFetchProductsHandler.Response(x.Id, x.Name, x.Price))
            .ToListAsync();

        var count = await context.Set<Entities.Product>().CountAsync();

        return new PaginatedResponse<IFetchProductsHandler.Response>(request.Page, request.PageSize)
            .SetData(products)
            .SetTotalItems(count);
    }
}
