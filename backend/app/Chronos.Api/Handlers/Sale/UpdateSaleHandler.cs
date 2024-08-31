﻿using Chronos.Api.Data;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Chronos.Api.Handlers.Sale;

public interface IUpdateSaleHandler
{
    Task Handle(Request request);

    public record Request(Guid Id, DateTime Date, decimal Total, List<Request.SaleItem> Items)
    {
        public record SaleItem(Guid ProductId, decimal Quantity, decimal Price, decimal Total);
    };
}

public class UpdateSaleHandler(Context context) : IUpdateSaleHandler
{
    public async Task Handle(IUpdateSaleHandler.Request request)
    {
        Validate(request);

        var sale = await context.Set<Entities.Sale>()
            .Include(s => s.Items)
            .FirstOrDefaultAsync(s => s.Id == request.Id)
            ?? throw new ValidationException("Sale not found");

        sale.Date = request.Date;
        sale.Total = request.Total;
        sale.LastUpdate = DateTime.Now;
        sale.Items = request.Items
            .Select(item => new Entities.SaleItem
            {
                Id = Guid.NewGuid(),
                CreatedAt = DateTime.Now,
                LastUpdate = DateTime.Now,
                ProductId = item.ProductId,
                Quantity = item.Quantity,
                Price = item.Price,
                Total = item.Total,
                SaleId = request.Id
            }).ToList();


        context.Set<Entities.Sale>().Update(sale);
        await context.SaveChangesAsync();
    }

    private static void Validate(IUpdateSaleHandler.Request request)
    {
        if (request.Id == Guid.Empty) throw new ValidationException("SaleId should be valid.");
        if (request.Items == null || !request.Items.Any()) throw new ValidationException("Sale must contain at least one item.");
        if (request.Total <= 0) throw new ValidationException("Total must be greater than zero.");
    }
}
