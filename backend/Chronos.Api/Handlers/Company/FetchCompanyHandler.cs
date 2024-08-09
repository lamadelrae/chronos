using Chronos.Api.Data;
using Chronos.Api.Entities.Enums;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Chronos.Api.Handlers.Company;

public interface IFetchCompanyHandler
{
    Task<Response> Handle(Request resquest);
    public record Request(Guid CompanyId, string? Cnpj);
    public record Response(Guid CompanyId, string CompanyName, string SocialReason, string Cnpj, Response.ResponseAddress Companyaddress)
    {
        public record ResponseAddress(string Address, string City, State State, string ZipCode);
    }
}

public class FetchCompanyHandler(Context context) : IFetchCompanyHandler
{
    public async Task<IFetchCompanyHandler.Response> Handle(IFetchCompanyHandler.Request request)
    {
        Validate(request);

        var company = await context.Set<Entities.Company>()
            .FirstAsync((company) => (request.Cnpj == null || company.Cnpj == request.Cnpj) && company.Id == request.CompanyId)
            ?? throw new ValidationException("Company not found");

        var companyAdress = new IFetchCompanyHandler.Response.ResponseAddress(
            company.Address.Address,
            company.Address.City,
            company.Address.State,
            company.Address.ZipCode);

        return new IFetchCompanyHandler.Response(company.Id, company.Name, company.SocialReason, company.Cnpj, companyAdress);
    }

    private static void Validate(IFetchCompanyHandler.Request request)
    {
        if (request.CompanyId == Guid.Empty) throw new ValidationException("CompanyId should be valid.");
    }
}
