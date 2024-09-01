using Chronos.Integration.Etrade;
using Chronos.Integration.Etrade.Data.Etrade;
using Chronos.Integration.Etrade.Data.Integration;
using Chronos.Integration.Etrade.Handlers;
using Chronos.Integration.Etrade.Services;
using Microsoft.EntityFrameworkCore;
using Quartz;

var builder = Host.CreateApplicationBuilder(args);

builder.Services.AddQuartz(q =>
{
    var key = new JobKey("Job");

    q.AddJob<Job>(j => j
    .WithIdentity(key)
    .Build());

    q.AddTrigger(t => t.ForJob(key)
    .WithIdentity("Job-trigger")
    .WithSchedule(CronScheduleBuilder.WeeklyOnDayAndHourAndMinute(DayOfWeek.Monday, 2, 0)));

    q.AddTrigger(t => t.ForJob(key)
    .WithIdentity("Job-now-trigger")
    .StartNow());
});

builder.Services.AddQuartzHostedService(q => q.WaitForJobsToComplete = true);

builder.Services.AddHttpClient("Chronos", options =>
{
    options.BaseAddress = new Uri(builder.Configuration.GetValue<string?>("Chronos:ApiUrl") ?? string.Empty);
});

builder.Services.AddDbContext<EtradeContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetValue<string?>("Etrade:Connection"));
});

builder.Services.AddDbContext<IntegrationContext>(options =>
{
    options.UseSqlite(builder.Configuration.GetValue<string?>("Integration:Connection"));
});

builder.Services.AddScoped<IChronosProductService, ChronosProductService>();
builder.Services.AddScoped<IChronosSaleService, ChronosSaleService>();
builder.Services.AddScoped<IProductSyncHandler, ProductSyncHandler>();
builder.Services.AddScoped<ISaleSyncHandler, SaleSyncHandler>();

var host = builder.Build();

using var scope = host.Services.CreateScope();
var integration = scope.ServiceProvider.GetRequiredService<IntegrationContext>();
integration.Database.EnsureCreated();

host.Run();
