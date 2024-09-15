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
    public async Task<IActionResult> Fetch(
        [FromQuery] int page,
        [FromQuery] int size,
        [FromQuery] DateTime? start, 
        [FromQuery] DateTime? end, 
        [FromQuery] IFetchSalesHandler.SortBy? sortBy, 
        [FromQuery] bool ascending)
    {
        var request = new IFetchSalesHandler.Request(page, size, start, end, sortBy, ascending);
        var response = await fetchSalesHandler.Handle(request);
        return Ok(response);
    }
}