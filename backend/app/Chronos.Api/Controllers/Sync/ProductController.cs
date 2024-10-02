using Chronos.Api.Handlers.Product;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Chronos.Api.Controllers.Sync;

[ApiController]
[Authorize(AuthenticationSchemes = "data-integration", Policy = "sync-data")]
[Route("api/sync/product")]
public class ProductController(
    ISaveProductHandler saveProductHandler,
    IUpdateProductHandler updateProductHandler) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Save([FromBody] ISaveProductHandler.Request request)
    {
        var response = await saveProductHandler.Handle(request);
        return Created("created", response);
    }

    [HttpPut]
    public async Task<IActionResult> Update([FromBody] IUpdateProductHandler.Request request)
    {
        await updateProductHandler.Handle(request);
        return Ok();
    }
}
