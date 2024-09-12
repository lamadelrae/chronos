using Chronos.Api.Data;
using Quartz;

namespace Chronos.Api.Jobs;

public class PredictionJob(Context dbContext) : IJob
{
    public async Task Execute(IJobExecutionContext context)
    {

    }
}
