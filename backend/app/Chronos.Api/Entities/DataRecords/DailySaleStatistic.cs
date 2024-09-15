namespace Chronos.Api.Entities.DataRecords;

public record DailySaleStatistic(DateOnly Date, int Quantity, decimal Total, decimal AverageTicket, decimal ProductQuantitySold, decimal AverageSellingPrice);
