using Chronos.Integration.Etrade.Handlers;

namespace Chronos.Integration.Etrade;

public class Worker(ILogger<Worker> logger, IProductSyncHandler productSync) : BackgroundService
{
    private readonly ILogger<Worker> _logger = logger;

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            if (_logger.IsEnabled(LogLevel.Information))
            {
                _logger.LogInformation("Worker running at: {time}", DateTimeOffset.Now);
            }

            await productSync.Handle();

            await Task.Delay(TimeSpan.FromDays(1), stoppingToken);
        }
    }
}
