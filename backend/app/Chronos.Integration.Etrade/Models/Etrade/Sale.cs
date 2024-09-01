namespace Chronos.Integration.Etrade.Models.Etrade;

public class Sale
{
    public Guid Id { get; set; }
    public DateTime Date { get; set; }
    public decimal Total { get; set; }
    public List<Item> Items { get; set; } = [];

    public class DataRecord
    {
        public Guid SaleId { get; set; }
        public DateTime SaleDate { get; set; }
        public decimal SaleTotal { get; set; }
        public Guid SaleItemProductId { get; set; }
        public decimal SaleItemQuantity { get; set; }
        public decimal SaleItemPrice { get; set; }
        public decimal SaleItemTotal { get; set; }
    }

    public class Item
    {
        public Guid ProductId { get; set; }
        public decimal Quantity { get; set; }
        public decimal Price { get; set; }
        public decimal Total { get; set; }
    }

}
