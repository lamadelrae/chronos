using Chronos.Api.Data;
using Chronos.Api.Entities.Enums;
using System.ComponentModel.DataAnnotations;

namespace Chronos.Api.Handlers.Company;

public interface ISaveCompanyHandler
{
    Task Handle(Request request);

    public record Request(string CompanyName, string SocialReason, string Cnpj, Request.RequestAddress Address)
    {
        public record RequestAddress(string Address, string City, State State, string ZipCode);
    };
}

public class SaveCompanyHandler(Context context) : ISaveCompanyHandler
{
    public async Task Handle(ISaveCompanyHandler.Request request)
    {
        Validate(request);

        var company = new Entities.Company
        {
            Id = Guid.NewGuid(),
            CreatedAt = DateTime.Now,
            LastUpdate = DateTime.Now,
            Name = request.CompanyName,
            SocialReason = request.SocialReason,
            Cnpj = request.Cnpj,
            Address = new Entities.Company.CompanyAddress
            {
                Address = request.Address.Address,
                City = request.Address.City,
                State = request.Address.State,
                ZipCode = request.Address.ZipCode,
            }
        };

        await context.Set<Entities.Company>().AddAsync(company);
        await context.SaveChangesAsync();
    }

    private static void Validate(ISaveCompanyHandler.Request request)
    {
        if (string.IsNullOrWhiteSpace(request.CompanyName)) throw new ValidationException("Name cannot be empty.");
        if (string.IsNullOrWhiteSpace(request.SocialReason)) throw new ValidationException("Email cannot be empty.");
        if (string.IsNullOrWhiteSpace(request.Cnpj)) throw new ValidationException("Password cannot be empty.");
        if (request.Address == null) throw new ValidationException("Address cannot be empty.");
    }
}
