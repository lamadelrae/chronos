namespace Chronos.Integration.Etrade.Models.Etrade;

public record Sale(Guid Id, DateTime Date, decimal Total, List<Sale.Item> Items)
{
    public record Item(Guid ProductId, decimal Quantity, decimal Price, decimal Total);

    public record DataRecord(Guid SaleId, DateTime SaleDate, decimal SaleTotal, Guid SaleItemProductId, decimal SaleItemQuantity, decimal SaleItemPrice, decimal SaleItemTotal);
}
