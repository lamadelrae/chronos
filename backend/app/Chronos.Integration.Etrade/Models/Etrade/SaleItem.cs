namespace Chronos.Integration.Etrade.Models.Etrade;

public class SaleItem
{
    public Guid ProductId { get; set; }
    public decimal Quantity { get; set; }
    public decimal Price { get; set; }
    public decimal Total { get; set; }
}
