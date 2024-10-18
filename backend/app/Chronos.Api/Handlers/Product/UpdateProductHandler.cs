using Chronos.Api.Data;
using System.ComponentModel.DataAnnotations;

namespace Chronos.Api.Handlers.Product;

public interface IUpdateProductHandler
{
    Task Handle(Request request);

    public record Request(Guid Id, string Name, decimal Price);
}

public class UpdateProductHandler(Context context) : IUpdateProductHandler
{
    public async Task Handle(IUpdateProductHandler.Request request)
    {
        Validate(request);

        var product = await context.Set<Entities.Product>().FindAsync(request.Id)
            ?? throw new ValidationException("Product not found");

        product.Name = request.Name;
        product.Price = request.Price;
        product.LastUpdate = DateTime.Now;

        context.Set<Entities.Product>().Update(product);
        await context.SaveChangesAsync();
    }

    private static void Validate(IUpdateProductHandler.Request request)
    {
        if (request.Id == Guid.Empty) throw new ValidationException("ProductId should be valid.");
        if (string.IsNullOrWhiteSpace(request.Name) || request.Name.Length > 250) throw new ValidationException("Name must be valid.");
        if (request.Price < 0) throw new ValidationException("Price must be greater than or equal to zero.");
    }
}
