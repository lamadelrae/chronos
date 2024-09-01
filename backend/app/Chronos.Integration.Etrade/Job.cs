using Chronos.Integration.Etrade.Handlers;
using Chronos.Integration.Etrade.Services;
using Quartz;

namespace Chronos.Integration.Etrade;

public class Job(
    ILastSyncService lastSyncService,
    IProductSyncHandler productSync,
    ISaleSyncHandler saleSync) : IJob
{
    public async Task Execute(IJobExecutionContext context)
    {
        await lastSyncService.EnsureCreated();

        await productSync.Handle();
        await saleSync.Handle();

        await lastSyncService.SetNow();
    }
}
