using Chronos.Api.Data;
using Chronos.Api.Entities.Enums;
using Chronos.Api.Handlers.User;
using System.ComponentModel.DataAnnotations;
namespace Chronos.Api.Handlers.Company
{
    public interface ISaveCompanyHandler
    {
        Task Handle(Request request);
        public record Request(string CompanyName, string SocialReason, string Cnpj, Request.Address Companyaddress) 
        {
            public record Address(string address, string city, State state, string zipCode);
        };
    }
    public class SaveCompanyHandler(Context context) : ISaveCompanyHandler
    {
        public readonly Context _context = context;

        public async Task Handle(ISaveCompanyHandler.Request request)
        {
            Validate(request);

            var company = new Entities.Company
            {
                Id = Guid.NewGuid(),
                Name = request.CompanyName,
                SocialReason = request.SocialReason,
                Cnpj = request.Cnpj,
                Address = new Entities.Company.CompanyAddress
                {
                    Address = request.Companyaddress.address,
                    City = request.Companyaddress.city,
                    State = request.Companyaddress.state,
                    ZipCode = request.Companyaddress.zipCode,
                }
            };

            await _context.Set<Entities.Company>().AddAsync(company);
            await _context.SaveChangesAsync();
        }

        private static void Validate(ISaveCompanyHandler.Request request)
        {
            
            if (string.IsNullOrWhiteSpace(request.CompanyName)) throw new ValidationException("Name cannot be empty.");
            if (string.IsNullOrWhiteSpace(request.SocialReason)) throw new ValidationException("Email cannot be empty.");
            if (string.IsNullOrWhiteSpace(request.Cnpj)) throw new ValidationException("Password cannot be empty.");
            if (request.Companyaddress == null) throw new ValidationException("Address cannot be empty.");
        }
    }
}
