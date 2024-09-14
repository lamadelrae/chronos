namespace Chronos.Api.Entities.DataRecords;

public record DailyProductStatistic(Guid Id, string Name, DateOnly Date, int Sales);