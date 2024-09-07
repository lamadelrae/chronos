using System.Text.Json;
using System.Text;

namespace Chronos.Api.Services;

public interface IPredictionHttpService
{
    Task<Response?> Post(Request request);

    public record Request(Guid ProductId, int Year, decimal Quantity, ICollection<Request.MonthRequest> Months)
    {
        public record MonthRequest(int Month, decimal Quantity);
    }

    public record Response(Guid ProductId, int Year, decimal Quantity, ICollection<Request.MonthRequest> Months)
    {
        public record MonthResponse(int Month, decimal Quantity);
    }
}

public class PredictionHttpService(IHttpClientFactory factory) : IPredictionHttpService
{
    public async Task<IPredictionHttpService.Response?> Post(IPredictionHttpService.Request request)
    {
        var client = factory.CreateClient("Prediction");
        var message = new HttpRequestMessage(HttpMethod.Post, "api/product")
        {
            Content = new StringContent(JsonSerializer.Serialize(request), Encoding.UTF8, "application/json")
        };

        var response = await client.SendAsync(message);
        if (!response.IsSuccessStatusCode)
        {
            return null;
        }

        return await response.Content.ReadFromJsonAsync<IPredictionHttpService.Response>();
    }
}
