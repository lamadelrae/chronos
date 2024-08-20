using Chronos.Api.Data;
using Chronos.Api.Entities.Enums;
using System.ComponentModel.DataAnnotations;

namespace Chronos.Api.Handlers.Company;

public interface IUpdateCompanyHandler
{
    Task Handle(Request request);

    public record Request(Guid Id, string CompanyName, string SocialReason, string Cnpj, Request.RequestAddress Address)
    {
        public record RequestAddress(string Address, string City, State State, string ZipCode);
    };
}

public class UpdateCompanyHandler(Context context) : IUpdateCompanyHandler
{
    public async Task Handle(IUpdateCompanyHandler.Request request)
    {
        Validate(request);

        var company = await context.Set<Entities.Company>().FindAsync(request.Id) ?? throw new ValidationException("Company not found");

        company.Name = request.CompanyName;
        company.SocialReason = request.SocialReason;
        company.Cnpj = request.Cnpj;

        company.Address = new Entities.Company.CompanyAddress
        {
            Address = request.Address.Address,
            City = request.Address.City,
            State = request.Address.State,
            ZipCode = request.Address.ZipCode,
        };

        context.Set<Entities.Company>().Update(company);
        await context.SaveChangesAsync();
    }

    private static void Validate(IUpdateCompanyHandler.Request request)
    {
        if (request.Id == Guid.Empty) throw new ValidationException("CompanyId should be valid.");
        if (string.IsNullOrWhiteSpace(request.CompanyName)) throw new ValidationException("Name cannot be empty.");
        if (string.IsNullOrWhiteSpace(request.SocialReason)) throw new ValidationException("Email cannot be empty.");
        if (string.IsNullOrWhiteSpace(request.Cnpj)) throw new ValidationException("Password cannot be empty.");
        if (request.Address == null) throw new ValidationException("Address cannot be empty.");
    }
}
