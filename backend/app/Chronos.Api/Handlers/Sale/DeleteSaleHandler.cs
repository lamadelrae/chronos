using Chronos.Api.Data;
using System.ComponentModel.DataAnnotations;

namespace Chronos.Api.Handlers.Sale;

public interface IDeleteSaleHandler
{
    Task Handle(Request request);
    public record Request(Guid Id);
}

public class DeleteSaleHandler(Context context) : IDeleteSaleHandler
{
    public async Task Handle(IDeleteSaleHandler.Request request)
    {
        Validate(request);

        var sale = await context.Set<Entities.Sale>().FindAsync(request.Id)
            ?? throw new ValidationException("Sale not found.");

        context.Set<Entities.Sale>().Remove(sale);

        await context.SaveChangesAsync();
    }

    private static void Validate(IDeleteSaleHandler.Request request)
    {
        if (request.Id == Guid.Empty) throw new ValidationException("SaleId should be valid");
    }
}
