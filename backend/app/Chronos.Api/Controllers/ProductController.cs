using Chronos.Api.Handlers.Product;
using Microsoft.AspNetCore.Mvc;

namespace Chronos.Api.Controllers;

[ApiController]
[Route("api/product")]
public class ProductController(
    ISaveProductHandler saveProductHandler,
    IDeleteProductHandler deleteProductHandler,
    IFetchProductsHandler fetchProductsHandler,
    IUpdateProductHandler updateProductHandler) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Save([FromBody] ISaveProductHandler.Request request)
    {
        var response = await saveProductHandler.Handle(request);
        return Created("created", response);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete([FromRoute] Guid id)
    {
        var request = new IDeleteProductHandler.Request(id);
        await deleteProductHandler.Handle(request);
        return Ok();
    }

    [HttpGet]
    public async Task<IActionResult> Fetch([FromQuery] int page, [FromQuery] int size, [FromQuery] Guid[]? ids)
    {
        var request = new IFetchProductsHandler.Request(page, size, ids);
        var response = await fetchProductsHandler.Handle(request);
        return Ok(response);
    }

    [HttpPut]
    public async Task<IActionResult> Update([FromBody] IUpdateProductHandler.Request request)
    {
        await updateProductHandler.Handle(request);
        return Ok();
    }
}