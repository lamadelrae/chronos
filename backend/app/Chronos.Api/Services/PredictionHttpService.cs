using System.Text.Json;
using System.Text;

namespace Chronos.Api.Services;

public interface IPredictionHttpService
{
    Task<Response?> Post(Request request);

    public record Request(string Product, IEnumerable<Request.Sale> Sales)
    {
        public record Sale(DateOnly Date, decimal Quantity);
    }

    public record Response(string Product, IEnumerable<Response.Sale> Sales)
    {
        public record Sale(DateOnly Date, decimal Quantity);
    }
}

public class PredictionHttpService(IHttpClientFactory factory) : IPredictionHttpService
{
    private static readonly JsonSerializerOptions _options = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    public async Task<IPredictionHttpService.Response?> Post(IPredictionHttpService.Request request)
    {
        var client = factory.CreateClient("Prediction");
        var message = new HttpRequestMessage(HttpMethod.Post, "prediction")
        {
            Content = new StringContent(JsonSerializer.Serialize(request, _options), Encoding.UTF8, "application/json")
        };

        var response = await client.SendAsync(message);
        if (!response.IsSuccessStatusCode)
        {
            return null;
        }

        return await response.Content.ReadFromJsonAsync<IPredictionHttpService.Response>();
    }
}
