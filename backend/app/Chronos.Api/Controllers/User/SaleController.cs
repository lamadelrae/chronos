using Chronos.Api.Handlers.Sale;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Chronos.Api.Controllers.User;

[Authorize]
[ApiController]
[Route("api/user/sale")]
public class SaleController(IFetchSalesHandler fetchSalesHandler) : ControllerBase
{

    [HttpGet]
    public async Task<IActionResult> FetchAll([FromQuery] int page, [FromQuery] int size)
    {
        var request = new IFetchSalesHandler.Request(page, size);
        var response = await fetchSalesHandler.Handle(request);
        return Ok(response);
    }
}