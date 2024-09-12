namespace Chronos.Api.Entities.DataRecords;

public class ProductStatistic
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public DateOnly Date { get; set; }
    public int Sales { get; set; }
}
