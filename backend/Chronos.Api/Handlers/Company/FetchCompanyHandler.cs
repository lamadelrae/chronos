using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Chronos.Api.Entities;
using Chronos.Api.Data;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
namespace Chronos.Api.Handlers.Company
{
    public interface IFetchCompanyHandler
    {
        Task<Response> Handle(Request resquest);
        public record Request (Guid CompanyId, string Cnpj = "");
        public record Response(Guid CompanyId, string CompanyName, string SocialReason, string Cnpj, Entities.Company.CompanyAddress Address);
    }
    public class FetchCompanyHandler(Context context) : IFetchCompanyHandler
    {
        private readonly Context _context = context;

        public async Task<IFetchCompanyHandler.Response> Handle(IFetchCompanyHandler.Request request)
        {
            Validate(request);

            var company = await _context.Set<Entities.Company>().FirstAsync((company) => (request.Cnpj == null || company.Cnpj == request.Cnpj) 
            && company.Id == request.CompanyId) ?? throw new ValidationException("Company not found");

            return new IFetchCompanyHandler.Response(company.Id, company.Name, company.SocialReason, company.Cnpj, company.Address);
        }

        private static void Validate(IFetchCompanyHandler.Request request)
        {
            if (request.CompanyId == Guid.Empty) throw new ValidationException("CompanyId should be valid.");
        }
    }

}
