using Chronos.Api.Handlers.Sale;
using Microsoft.AspNetCore.Mvc;

namespace Chronos.Api.Controllers;

[ApiController]
[Route("api/sale")]
public class SaleController(
    ISaveSaleHandler saveSaleHandler,
    IDeleteSaleHandler deleteSaleHandler,
    IFetchSalesHandler fetchSalesHandler,
    IUpdateSaleHandler updateSaleHandler) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Save([FromBody] ISaveSaleHandler.Request request)
    {
        await saveSaleHandler.Handle(request);
        return Created();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete([FromRoute] Guid id)
    {
        var request = new IDeleteSaleHandler.Request(id);
        await deleteSaleHandler.Handle(request);
        return Ok();
    }

    [HttpGet]
    public async Task<IActionResult> FetchAll([FromQuery] int page, [FromQuery] int size)
    {
        var request = new IFetchSalesHandler.Request(page, size);
        var response = await fetchSalesHandler.Handle(request);
        return Ok(response);
    }

    [HttpPut]
    public async Task<IActionResult> Update([FromBody] IUpdateSaleHandler.Request request)
    {
        await updateSaleHandler.Handle(request);
        return Ok();
    }
}