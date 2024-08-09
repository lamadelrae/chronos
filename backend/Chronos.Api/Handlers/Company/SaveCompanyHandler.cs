using Chronos.Api.Data;
using Chronos.Api.Handlers.User;
using System.ComponentModel.DataAnnotations;
namespace Chronos.Api.Handlers.Company
{
    public interface ISaveCompanyHandler
    {
        Task Handle(Request request);
        public record Request(Guid CompanyId, string CompanyName, string SocialReason, string Cnpj, Entities.Company.CompanyAddress Address);
    }
    public class SaveCompanyHandler(Context context) : ISaveCompanyHandler
    {
        public readonly Context _context = context;

        public async Task Handle(ISaveCompanyHandler.Request request)
        {
            Validate(request);

            var company = new Entities.Company
            {
                Id = request.CompanyId,
                Name = request.CompanyName,
                SocialReason = request.SocialReason,
                Cnpj = request.Cnpj,
                Address = request.Address
            };

            await _context.Set<Entities.Company>().AddAsync(company);
            await _context.SaveChangesAsync();
        }

        private static void Validate(ISaveCompanyHandler.Request request)
        {
            if (request.CompanyId == Guid.Empty) throw new ValidationException("CompanyId should be valid.");
            if (string.IsNullOrWhiteSpace(request.CompanyName)) throw new ValidationException("Name cannot be empty.");
            if (string.IsNullOrWhiteSpace(request.SocialReason)) throw new ValidationException("Email cannot be empty.");
            if (string.IsNullOrWhiteSpace(request.Cnpj)) throw new ValidationException("Password cannot be empty.");
            if (request.Address == null) throw new ValidationException("Address cannot be empty.");
        }
    }
}
