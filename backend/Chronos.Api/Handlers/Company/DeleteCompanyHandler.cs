using Chronos.Api.Data;
using System.ComponentModel.DataAnnotations;

namespace Chronos.Api.Handlers.Company;

public interface IDeleteCompanyHandler
{
    Task Handle(Request request);
    public record Request(Guid Id);
}

public class DeleteCompanyHandler(Context context) : IDeleteCompanyHandler
{
    public async Task Handle(IDeleteCompanyHandler.Request request)
    {
        Validate(request);

        var company = await context.Set<Entities.Company>().FindAsync(request.Id) ?? throw new ValidationException("Company not found.");

        context.Set<Entities.Company>().Remove(company);

        await context.SaveChangesAsync();
    }

    private static void Validate(IDeleteCompanyHandler.Request request)
    {
        if (request.Id == Guid.Empty) throw new ValidationException("CompanyId should be valid");
    }
}
