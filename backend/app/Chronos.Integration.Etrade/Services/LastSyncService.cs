using Chronos.Integration.Etrade.Data.Integration;
using Chronos.Integration.Etrade.Models.Integration;
using Microsoft.EntityFrameworkCore;

namespace Chronos.Integration.Etrade.Services;

public interface ILastSyncService
{
    Task<DateTime> Get();
    Task EnsureCreated();
    Task SetNow();
}

public class LastSyncService(IntegrationContext integrationContext) : ILastSyncService
{
    public async Task<DateTime> Get()
    {
        var lastSync = await integrationContext.Set<LastSync>().FirstAsync();

        return lastSync.Value;
    }

    public async Task EnsureCreated()
    {
        var exists = await integrationContext.Set<LastSync>().AnyAsync();

        if (!exists)
        {
            var lastSync = new LastSync { Value = DateTime.Now.AddYears(-4) };
            await integrationContext.Set<LastSync>().AddAsync(lastSync);
            await integrationContext.SaveChangesAsync();
        }
    }

    public async Task SetNow()
    {
        var lastSync = await integrationContext.Set<LastSync>().FirstAsync();
        lastSync.Value = DateTime.Now;
        await integrationContext.SaveChangesAsync();
    }
}
