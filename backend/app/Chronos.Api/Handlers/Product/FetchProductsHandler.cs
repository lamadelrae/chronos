using Chronos.Api.Data;
using Chronos.Api.Shared.Responses;
using Chronos.Api.Shared.Users;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

namespace Chronos.Api.Handlers.Product;

public interface IFetchProductsHandler
{
    Task<PaginatedResponse<Response>> Handle(Request request);

    public record Request(int Page, int PageSize, string? Name, Guid[]? Ids, SortBy? SortBy, bool Ascending);
    public record Response(Guid Id, string Name, decimal Price);

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum SortBy { Name, Price, CreatedAt }
}

public class FetchProductsHandler(Context context, IUserInfo userInfo) : IFetchProductsHandler
{
    public async Task<PaginatedResponse<IFetchProductsHandler.Response>> Handle(IFetchProductsHandler.Request request)
    {
        var query = BuildQuery(request);

        var products = await query
            .Skip(request.PageSize * request.Page)
            .Take(request.PageSize)
            .Select(x => new IFetchProductsHandler.Response(x.Id, x.Name, x.Price))
            .ToListAsync();

        var count = await query.CountAsync();

        return new PaginatedResponse<IFetchProductsHandler.Response>(request.Page, request.PageSize)
            .SetData(products)
            .SetTotalItems(count);
    }

    private IQueryable<Entities.Product> BuildQuery(IFetchProductsHandler.Request request)
    {
        var query = context.Set<Entities.Product>()
                .Where(product => product.CompanyId == userInfo.CompanyId)
                .AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.Name))
        {
            query = query.Where(product => product.Name.Contains(request.Name));
        }

        if (request.Ids != null && request.Ids.Length != 0)
        {
            query = query.Where(product => request.Ids.Contains(product.Id));
        }

        if (request.SortBy == IFetchProductsHandler.SortBy.Name)
        {
            query = request.Ascending
                ? query.OrderBy(product => product.Name)
                : query.OrderByDescending(product => product.Name);
        }
        else if (request.SortBy == IFetchProductsHandler.SortBy.Price)
        {
            query = request.Ascending
                    ? query.OrderBy(product => product.Price)
                    : query.OrderByDescending(product => product.Price);
        }
        else if (request.SortBy == IFetchProductsHandler.SortBy.CreatedAt)
        {
            query = request.Ascending
                ? query.OrderBy(product => product.CreatedAt)
                : query.OrderByDescending(product => product.CreatedAt);
        }

        return query;
    }
}
