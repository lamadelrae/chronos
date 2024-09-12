using Chronos.Api.Data;
using Chronos.Api.Shared.Users;
using Microsoft.EntityFrameworkCore;

namespace Chronos.Api.Handlers.Prediction;


public interface IFetchPredictionsHandler
{
    Task<IEnumerable<Response>> Handle();

    public record Response(Guid ProductId, string ProductName, IEnumerable<Response.Sale> Sales)
    {
        public record Sale(DateOnly Date, decimal Quantity);
    }
}

public class FetchPredictionsHandler(Context context, IUserInfo userInfo) : IFetchPredictionsHandler
{
    public async Task<IEnumerable<IFetchPredictionsHandler.Response>> Handle()
    {
        var predictions = await context.Set<Entities.Prediction>()
            .Include(p => p.Product)
            .Include(p => p.Sales)
            .Where(prediction => prediction.Product.CompanyId == userInfo.CompanyId)
            .Select(prediction =>
                new IFetchPredictionsHandler.Response(prediction.ProductId, prediction.Product.Name, prediction.Sales.Select(sale => new IFetchPredictionsHandler.Response.Sale(sale.Date, sale.Quantity))))
            .ToListAsync();

        return predictions;
    }
}
