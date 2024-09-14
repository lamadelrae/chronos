namespace Chronos.Api.Entities.DataRecords;

public record DailySaleStatistic(DateOnly Date, int SaleQuantity, decimal Total, decimal AverageTicket, decimal ProductQuantitySold, decimal AverageSellingPrice);
