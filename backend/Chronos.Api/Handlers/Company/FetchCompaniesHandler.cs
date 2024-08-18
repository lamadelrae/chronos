using Chronos.Api.Data;
using Chronos.Api.Entities.Enums;
using Chronos.Api.Shared.Responses;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Chronos.Api.Handlers.Company;

public interface IFetchCompaniesHandler
{
    Task<PaginatedResponse<Response>> Handle(Request request);
    public record Request(int Page, int Size, Guid? CompanyId, string? Cnpj);
    public record Response(Guid CompanyId, string CompanyName, string SocialReason, string Cnpj, Response.ResponseAddress Companyaddress)
    {
        public record ResponseAddress(string Address, string City, State State, string ZipCode);
    }
}

public class FetchCompaniesHandler(Context context) : IFetchCompaniesHandler
{
    public async Task<PaginatedResponse<IFetchCompaniesHandler.Response>> Handle(IFetchCompaniesHandler.Request request)
    {
        Validate(request);

        var companies = await context.Set<Entities.Company>()
            .Where((company) => (request.Cnpj == null || company.Cnpj == request.Cnpj) && company.Id == request.CompanyId)
            .Select((company) => new IFetchCompaniesHandler.Response(company.Id, company.Name, company.SocialReason, company.Cnpj,
                new IFetchCompaniesHandler.Response.ResponseAddress(company.Address.Address, company.Address.City, company.Address.State, company.Address.ZipCode)))
            .ToListAsync();

        var count = await context.Set<Entities.Company>().CountAsync();

        return new PaginatedResponse<IFetchCompaniesHandler.Response>(request.Page, request.Size)
            .SetData(companies)
            .SetTotalItems(count);
    }

    private static void Validate(IFetchCompaniesHandler.Request request)
    {
        if (request.CompanyId == Guid.Empty) throw new ValidationException("CompanyId should be valid.");
    }
}
