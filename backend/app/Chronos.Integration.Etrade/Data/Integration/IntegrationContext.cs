using Chronos.Integration.Etrade.Data.Integration.Mappings;
using Microsoft.EntityFrameworkCore;

namespace Chronos.Integration.Etrade.Data.Integration;

public class IntegrationContext(DbContextOptions<IntegrationContext> options) : DbContext(options)
{
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfiguration(new SyncedProductMapping());
        modelBuilder.ApplyConfiguration(new SyncedSaleMapping());
    }
}