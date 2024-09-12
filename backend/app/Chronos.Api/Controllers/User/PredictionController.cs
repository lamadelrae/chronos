using Chronos.Api.Handlers.Prediction;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Chronos.Api.Controllers.User;


[Authorize]
[ApiController]
[Route("api/user/predictions")]
public class PredictionController(IFetchPredictionsHandler fetchPredictionsHandler) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Fetch()
    {
        var response = await fetchPredictionsHandler.Handle();
        return Ok(response);
    }
}
