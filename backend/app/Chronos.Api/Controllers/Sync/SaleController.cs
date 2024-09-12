using Chronos.Api.Handlers.Sale;
using Microsoft.AspNetCore.Mvc;

namespace Chronos.Api.Controllers.Sync;

[ApiController]
[Route("api/sync/sale")]
public class SaleController(ISaveSaleHandler saveSaleHandler) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Save([FromBody] ISaveSaleHandler.Request request)
    {
        var response = await saveSaleHandler.Handle(request);
        return Created("created", response);
    }
}