using Chronos.Api.Data;
using Chronos.Api.Handlers.User;
using System.ComponentModel.DataAnnotations;
namespace Chronos.Api.Handlers.Company
{
    public interface IDeleteCompanyHandler
    {
        Task Handle(Request request);
        public record Request(Guid Id);
    }
    public class DeleteCompanyHandler(Context context) : IDeleteCompanyHandler
    {
        private readonly Context _context = context;
        public async Task Handle(IDeleteCompanyHandler.Request request)
        {
            var company = await _context.Set<Entities.Company>().FindAsync(request.Id) ?? throw new ValidationException("Company not found.");
            _context.Set<Entities.Company>().Remove(company);
            await _context.SaveChangesAsync();
        }

        private static void Validate(IDeleteCompanyHandler.Request request)
        {
            if (request.Id == Guid.Empty) throw new ValidationException("CompanyId should be valid");
        }
    }
}
