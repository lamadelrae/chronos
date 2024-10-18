using Chronos.Api.Data;
using Chronos.Api.Entities.Enums;
using Chronos.Api.Shared.Extensions;
using Microsoft.IdentityModel.Tokens;
using System.ComponentModel.DataAnnotations;

namespace Chronos.Api.Handlers.Company;

public interface ISaveCompanyHandler
{
    Task<Response> Handle(Request request);

    public record Request(string CompanyName, string SocialReason, string Cnpj, Request.RequestAddress Address)
    {
        public record RequestAddress(string Address, string City, State State, string ZipCode);
    };

    public record Response(Guid Id); 
}

public class SaveCompanyHandler(Context context) : ISaveCompanyHandler
{
    public async Task<ISaveCompanyHandler.Response> Handle(ISaveCompanyHandler.Request request)
    {
        Validate(request);

        var company = new Entities.Company
        {
            Id = Guid.NewGuid(),
            CreatedAt = DateTime.Now,
            LastUpdate = DateTime.Now,
            Name = request.CompanyName,
            SocialReason = request.SocialReason,
            Cnpj = request.Cnpj.RemoveCnpjFormat(),
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

        return new ISaveCompanyHandler.Response(company.Id);
    }

    private static void Validate(ISaveCompanyHandler.Request request)
    {
        if (string.IsNullOrWhiteSpace(request.CompanyName) || request.CompanyName.Length > 250) throw new ValidationException("Name cannot be empty.");
        if (string.IsNullOrWhiteSpace(request.SocialReason) || request.SocialReason.Length > 250) throw new ValidationException("Email cannot be empty.");
        if (string.IsNullOrWhiteSpace(request.Cnpj) || request.Cnpj.RemoveCnpjFormat().Length > 14 || !request.Cnpj.IsValidCnpj()) throw new ValidationException("Cnpj should be valid.");

        if (request.Address == null) throw new ValidationException("Address cannot be empty.");
        if (string.IsNullOrEmpty(request.Address.Address)) throw new ValidationException("Address cannot be empty.");
        if (string.IsNullOrEmpty(request.Address.City)) throw new ValidationException("City cannot be empty.");
        if (string.IsNullOrEmpty(request.Address.ZipCode)) throw new ValidationException("ZipCode cannot be empty.");
    }
}
