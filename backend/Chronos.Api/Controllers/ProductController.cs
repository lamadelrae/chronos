using Chronos.Api.Handlers.Product;
using Microsoft.AspNetCore.Mvc;

namespace Chronos.Api.Controllers;

[ApiController]
[Route("api/product")]
public class ProductController(
    ISaveProductHandler saveProductHandler,
    IDeleteProductHandler deleteProductHandler,
    IFetchProductHandler fetchProductHandler,
    IFetchProductsHandler fetchProductsHandler,
    IUpdateProductHandler updateProductHandler) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Save([FromBody] ISaveProductHandler.Request request)
    {
        await saveProductHandler.Handle(request);
        return Created();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete([FromRoute] Guid id)
    {
        var request = new IDeleteProductHandler.Request(id);
        await deleteProductHandler.Handle(request);
        return Ok();
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Fetch([FromRoute] Guid id, string? name)
    {
        var request = new IFetchProductHandler.Request(id, name);
        var response = await fetchProductHandler.Handle(request);
        return Ok(response);
    }

    [HttpGet]
    public async Task<IActionResult> FetchAll([FromQuery] int page, [FromQuery] int size)
    {
        var request = new IFetchProductsHandler.Request(page, size);
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