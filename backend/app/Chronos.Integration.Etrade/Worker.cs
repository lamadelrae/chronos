using Chronos.Integration.Etrade.Handlers;

namespace Chronos.Integration.Etrade;

public class Worker(ILogger<Worker> logger, IServiceScopeFactory factory) : BackgroundService
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

            var scope = factory.CreateScope();
            var productSync = scope.ServiceProvider.GetRequiredService<IProductSyncHandler>();
            var saleSync = scope.ServiceProvider.GetRequiredService<ISaleSyncHandler>();

            await productSync.Handle();
            await saleSync.Handle();

            scope.Dispose();

            await Task.Delay(TimeSpan.FromDays(1), stoppingToken);
        }
    }
}
