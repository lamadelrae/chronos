using Chronos.Api.Handlers.Metrics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Chronos.Api.Controllers.User;

[Authorize]
[ApiController]
[Route("api/user/metrics")]
public class MetricsController(IFetchMetricsHandler fetchMetricsHandler) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Fetch([FromQuery] DateTime date)
    {
        var response = await fetchMetricsHandler.Handle(DateOnly.FromDateTime(date));
        return Ok(response);
    }
}
