using Chronos.Api.Handlers.Product;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Chronos.Api.Controllers.User;

[Authorize]
[ApiController]
[Route("api/user/product")]
public class ProductController(IFetchProductsHandler fetchProductsHandler) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Fetch([FromQuery] int page, [FromQuery] int size, [FromQuery] Guid[]? ids)
    {
        var request = new IFetchProductsHandler.Request(page, size, ids);
        var response = await fetchProductsHandler.Handle(request);
        return Ok(response);
    }
}