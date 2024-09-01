using Chronos.Api.Data;
using Chronos.Api.Entities;
using System.ComponentModel.DataAnnotations;

namespace Chronos.Api.Handlers.Sale;

public interface ISaveSaleHandler
{
    Task<Response> Handle(Request request);

    public record Request(Guid CompanyId, DateTime Date, decimal Total, List<Request.SaleItem> Items)
    {
        public record SaleItem(Guid ProductId, decimal Quantity, decimal Price, decimal Total);
    };
    public record Response(Guid Id);
}

public class SaveSaleHandler(Context context) : ISaveSaleHandler
{
    public async Task<ISaveSaleHandler.Response> Handle(ISaveSaleHandler.Request request)
    {
        Validate(request);

        var sale = new Entities.Sale
        {
            Id = Guid.NewGuid(),
            LastUpdate = DateTime.Now,
            CreatedAt = DateTime.Now,
            CompanyId = request.CompanyId,
            Date = request.Date,
            Total = request.Total,
            Items = request.Items.Select(i => new SaleItem
            {
                Id = Guid.NewGuid(),
                LastUpdate = DateTime.Now,
                CreatedAt = DateTime.Now,
                ProductId = i.ProductId,
                Quantity = i.Quantity,
                Price = i.Price,
                Total = i.Total
            }).ToList()
        };

        await context.Set<Entities.Sale>().AddAsync(sale);
        await context.SaveChangesAsync();

        return new ISaveSaleHandler.Response(sale.Id);
    }

    private static void Validate(ISaveSaleHandler.Request request)
    {
        if (request.CompanyId == Guid.Empty) throw new ValidationException("CompanyId cannot be empty.");
        if (request.Items == null || !request.Items.Any()) throw new ValidationException("Sale must contain at least one item.");
        if (request.Total < 0) throw new ValidationException("Total must be greater than or equal to zero.");
    }
}
