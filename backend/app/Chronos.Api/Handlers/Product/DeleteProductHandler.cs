using Chronos.Api.Data;
using System.ComponentModel.DataAnnotations;

namespace Chronos.Api.Handlers.Product;

public interface IDeleteProductHandler
{
    Task Handle(Request request);
    public record Request(Guid Id);
}

public class DeleteProductHandler(Context context) : IDeleteProductHandler
{
    public async Task Handle(IDeleteProductHandler.Request request)
    {
        Validate(request);

        var product = await context.Set<Entities.Product>().FindAsync(request.Id)
            ?? throw new ValidationException("Product not found.");

        context.Set<Entities.Product>().Remove(product);

        await context.SaveChangesAsync();
    }

    private static void Validate(IDeleteProductHandler.Request request)
    {
        if (request.Id == Guid.Empty) throw new ValidationException("ProductId should be valid");
    }
}