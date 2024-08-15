using Chronos.Api.Data;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Chronos.Api.Handlers.Product
{
    public interface IFetchProductHandler
    {
        Task<Response> Handle(Request request);
        public record Request(Guid ProductId, string? Name);
        public record Response(Guid ProductId, string Name, decimal Price, Response.ResponseCompany ProductCompany)
        {
            public record ResponseCompany(Guid CompanyId, string CompanyName);
        }
    }

    public class FetchProductHandler(Context context) : IFetchProductHandler
    {
        public async Task<IFetchProductHandler.Response> Handle(IFetchProductHandler.Request request)
        {
            Validate(request);

            var product = await context.Set<Entities.Product>()
                .FirstAsync(p => (request.Name == null || p.Name == request.Name) && p.Id == request.ProductId)
                ?? throw new ValidationException("Product not found");

            var productCompany = new IFetchProductHandler.Response.ResponseCompany(
                product.Company.Id,
                product.Company.Name);

            return new IFetchProductHandler.Response(product.Id, product.Name, product.Price, productCompany);
        }

        private static void Validate(IFetchProductHandler.Request request)
        {
            if (request.ProductId == Guid.Empty) throw new ValidationException("ProductId should be valid.");
        }
    }
}
