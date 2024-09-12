using System.Net.Http.Json;
using System.Text;
using System.Text.Json;

namespace Chronos.Integration.Etrade.Services;

public interface IChronosSaleService
{
    Task<CreateSaleResponse?> Post(CreateSaleRequest sale);

    record CreateSaleRequest(Guid CompanyId, DateTime Date, decimal Total, IEnumerable<CreateSaleRequest.SaleItem> Items)
    {
        public record SaleItem(Guid ProductId, decimal Quantity, decimal Price, decimal Total);
    }

    record CreateSaleResponse(Guid Id);
}

public class ChronosSaleService(IHttpClientFactory factory) : IChronosSaleService
{
    public async Task<IChronosSaleService.CreateSaleResponse?> Post(IChronosSaleService.CreateSaleRequest sale)
    {
        var client = factory.CreateClient("Chronos");
        var request = new HttpRequestMessage(HttpMethod.Post, "api/sync/sale")
        {
            Content = new StringContent(JsonSerializer.Serialize(sale), Encoding.UTF8, "application/json")
        };

        var response = await client.SendAsync(request);
        if (!response.IsSuccessStatusCode)
        {
            return null;
        }

        return await response.Content.ReadFromJsonAsync<IChronosSaleService.CreateSaleResponse>();
    }
}
