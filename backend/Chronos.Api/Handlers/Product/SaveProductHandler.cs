using Chronos.Api.Data;
using Chronos.Api.Entities;
using System.ComponentModel.DataAnnotations;

namespace Chronos.Api.Handlers.Product;

public interface ISaveProductHandler
{
    Task Handle(Request request);

    public record Request(Guid CompanyId, string Name, decimal Price);
}

public class SaveProductHandler(Context context) : ISaveProductHandler
{
    public async Task Handle(ISaveProductHandler.Request request)
    {
        Validate(request);

        var product = new Entities.Product
        {
            Id = Guid.NewGuid(),
            CompanyId = request.CompanyId,
            Name = request.Name,
            Price = request.Price
        };

        await context.Set<Entities.Product>().AddAsync(product);
        await context.SaveChangesAsync();
    }

    private static void Validate(ISaveProductHandler.Request request)
    {
        if (request.CompanyId == Guid.Empty) throw new ValidationException("CompanyId cannot be empty.");
        if (string.IsNullOrWhiteSpace(request.Name)) throw new ValidationException("Name cannot be empty.");
        if (request.Price <= 0) throw new ValidationException("Price must be greater than zero.");
    }
}
