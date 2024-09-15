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
    public async Task<IActionResult> Fetch(Guid? productId)
    {
        var response = await fetchPredictionsHandler.Handle(productId);
        return Ok(response);
    }
}
