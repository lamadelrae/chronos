namespace Chronos.Integration.Etrade.Models.Etrade;

public class Sale
{
    public Guid Id { get; set; }
    public DateTime Date { get; set; }
    public decimal Total { get; set; }
    public List<SaleItem> Items { get; set; } = [];
}
