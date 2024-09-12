using Chronos.Api.Data;
using Chronos.Api.Entities.Enums;
using Chronos.Api.Shared.Users;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Chronos.Api.Handlers.Company;

public interface IFetchCurrentCompanyHandler
{
    Task<Response> Handle();
    public record Response(Guid Id, string CompanyName, string SocialReason, string Cnpj, Response.ResponseAddress Companyaddress)
    {
        public record ResponseAddress(string Address, string City, State State, string ZipCode);
    }
}

public class FetchCurrentCompanyHandler(Context context, IUserInfo userInfo) : IFetchCurrentCompanyHandler
{
    public async Task<IFetchCurrentCompanyHandler.Response> Handle()
    {
        var company = await context.Set<Entities.Company>()
            .FirstOrDefaultAsync(company => company.Id == userInfo.CompanyId)
            ?? throw new ValidationException("Company not found.");

        return new IFetchCurrentCompanyHandler.Response(company.Id, company.Name, company.SocialReason, company.Cnpj,
            new IFetchCurrentCompanyHandler.Response.ResponseAddress(company.Address.Address, company.Address.City, company.Address.State, company.Address.ZipCode));
    }
}
