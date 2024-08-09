using Chronos.Api.Data;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
namespace Chronos.Api.Handlers.Company
{
    public interface IUpdateCompanyHandler
    {
        Task Handle(Request request);
        public record Request(Guid id, string CompanyName, string SocialReason, string Cnpj, Entities.Company.CompanyAddress Address); 
    }
    public class UpdateCompanyHandler(Context context) : IUpdateCompanyHandler
    {
        private readonly Context _context = context;

        public async Task Handle(IUpdateCompanyHandler.Request request)
        {
            Validate(request);
            var company = await _context.Set<Entities.Company>().FindAsync(request.id) ?? throw new ValidationException("Company not found");
            company.Name = request.CompanyName;
            company.SocialReason = request.SocialReason;
            company.Cnpj = request.Cnpj;
            company.Address = request.Address;

            _context.Set<Entities.Company>().Update(company);
            await _context.SaveChangesAsync();
        }

        private static void Validate(IUpdateCompanyHandler.Request request)
        {
            if(request.id == Guid.Empty) throw new ValidationException("CompanyId should be valid.");
            if (string.IsNullOrWhiteSpace(request.CompanyName)) throw new ValidationException("Name cannot be empty.");
            if (string.IsNullOrWhiteSpace(request.SocialReason)) throw new ValidationException("Email cannot be empty.");
            if (string.IsNullOrWhiteSpace(request.Cnpj)) throw new ValidationException("Password cannot be empty.");
            if (request.Address == null) throw new ValidationException("Address cannot be empty.");
        }
    }
}
