namespace Chronos.Integration.Etrade.Models.Integration;

public class SyncedSale
{
    public Guid ChronosId { get; set; }
    public Guid EtradeId { get; set; }
    public DateTime LastUpdate { get; set; }
}
