using Chronos.Integration.Etrade.Handlers;
using Quartz;

namespace Chronos.Integration.Etrade;

public class Job(IProductSyncHandler productSync, ISaleSyncHandler saleSync) : IJob
{
    public async Task Execute(IJobExecutionContext context)
    {
        await productSync.Handle();
        await saleSync.Handle();
    }
}
