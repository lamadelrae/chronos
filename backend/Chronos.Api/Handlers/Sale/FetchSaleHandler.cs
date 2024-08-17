using Chronos.Api.Data;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Chronos.Api.Handlers.Sale;

public interface IFetchSaleHandler
{
    Task<Response> Handle(Request request);
    public record Request(Guid SaleId);
    public record Response(Guid SaleId, Guid CompanyId, DateTime Date, decimal Total, Response.ResponseCompany SaleCompany, List<Response.ResponseSaleItem> Items)
    {
        public record ResponseCompany(Guid CompanyId, string CompanyName);
        public record ResponseSaleItem(Guid SaleItemId, Guid ProductId, int Quantity, decimal Price, decimal Total);
    }
}

public class FetchSaleHandler(Context context) : IFetchSaleHandler
{
    public async Task<IFetchSaleHandler.Response> Handle(IFetchSaleHandler.Request request)
    {
        Validate(request);

        var sale = await context.Set<Entities.Sale>()
            .Include(s => s.Company)
            .Include(s => s.Items)
            .ThenInclude(i => i.Product)
            .FirstAsync(s => s.Id == request.SaleId) ?? throw new ValidationException("Sale not found");

        var company = new IFetchSaleHandler.Response.ResponseCompany(
            sale.Company.Id,
            sale.Company.Name);

        var items = sale.Items
            .Select(i => new IFetchSaleHandler.Response.ResponseSaleItem(i.Id, i.ProductId, i.Quantity, i.Price, i.Total))
            .ToList();

        return new IFetchSaleHandler.Response(sale.Id, sale.CompanyId, sale.Date, sale.Total, company, items);
    }

    private static void Validate(IFetchSaleHandler.Request request)
    {
        if (request.SaleId == Guid.Empty) throw new ValidationException("SaleId should be valid.");
    }
}
