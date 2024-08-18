using System.Net.Http.Json;
using System.Text.Json;

namespace Chronos.Integration.Etrade.Services;

public interface IChronosProductService
{
    Task<CreateProductResponse?> Post(CreateProductRequest product);
    Task<bool> Put(UpdateProduct product);

    record CreateProductRequest(Guid CompanyId, string Name, decimal Price);
    record CreateProductResponse(Guid Id);
    record UpdateProduct(Guid Id, string Name, decimal Price);
}

public class ChronosProductService(IHttpClientFactory factory) : IChronosProductService
{
    public async Task<IChronosProductService.CreateProductResponse?> Post(IChronosProductService.CreateProductRequest product)
    {
        var client = factory.CreateClient("Chronos");
        var request = new HttpRequestMessage(HttpMethod.Post, "api/product")
        {
            Content = new StringContent(JsonSerializer.Serialize(product))
        };

        var response = await client.SendAsync(request);
        if (!response.IsSuccessStatusCode)
        {
            return null;
        }

        return await response.Content.ReadFromJsonAsync<IChronosProductService.CreateProductResponse>();
    }

    public async Task<bool> Put(IChronosProductService.UpdateProduct product)
    {
        var client = factory.CreateClient("Chronos");
        var request = new HttpRequestMessage(HttpMethod.Put, "api/product")
        {
            Content = new StringContent(JsonSerializer.Serialize(product))
        };
        var response = await client.SendAsync(request);
        return response.IsSuccessStatusCode;
    }
}
