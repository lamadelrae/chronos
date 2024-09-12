using Chronos.Api.ApiConcerns;
using Chronos.Api.Data;
using Chronos.Api.Handlers.Auth;
using Chronos.Api.Handlers.Company;
using Chronos.Api.Handlers.Prediction;
using Chronos.Api.Handlers.Product;
using Chronos.Api.Handlers.Sale;
using Chronos.Api.Handlers.User;
using Chronos.Api.Jobs;
using Chronos.Api.Services;
using Chronos.Api.Shared.Extensions;
using Chronos.Api.Shared.Users;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Quartz;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<Context>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("Chronos"));
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.CustomSchemaIds(type => type.FriendlyId());

    options.AddSecurityDefinition("Authorization", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Authorization",
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        { new OpenApiSecurityScheme { Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Authorization" } }, Array.Empty<string>() }
    });
});

builder.Services.AddQuartz(q =>
{
    var key = new JobKey("Job");

    q.AddJob<PredictionJob>(j => j
    .WithIdentity(key)
    .Build());

    q.AddTrigger(t => t.ForJob(key)
    .WithIdentity("Job-trigger")
    .WithSchedule(CronScheduleBuilder.WeeklyOnDayAndHourAndMinute(DayOfWeek.Sunday, 2, 0)));

    q.AddTrigger(t => t.ForJob(key)
    .WithIdentity("Job-now-trigger")
    .StartNow());
});

builder.Services.AddQuartzHostedService(q => q.WaitForJobsToComplete = true);

builder.Services.AddHttpClient("Prediction", options =>
{
    options.BaseAddress = new Uri(builder.Configuration.GetValue<string?>("Prediction:ApiUrl") ?? string.Empty);
});

builder.Services.AddScoped<IAuthHandler, AuthHandler>();
builder.Services.AddScoped<IUserInfo, UserInfo>();
builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();


builder.Services
    .AddScoped<IFetchPredictionsHandler, FetchPredictionsHandler>();

builder.Services
    .AddScoped<ISaveProductHandler, SaveProductHandler>()
    .AddScoped<IUpdateProductHandler, UpdateProductHandler>()
    .AddScoped<IFetchProductsHandler, FetchProductsHandler>();

builder.Services
    .AddScoped<ISaveSaleHandler, SaveSaleHandler>()
    .AddScoped<IFetchSalesHandler, FetchSalesHandler>();

builder.Services
    .AddScoped<ISaveUserHandler, SaveUserHandler>()
    .AddScoped<IFetchCurrentUserHandler, FetchCurrentUserHandler>()
    .AddScoped<IUpdateUserHandler, UpdateUserHandler>();

builder.Services
    .AddScoped<ISaveCompanyHandler, SaveCompanyHandler>()
    .AddScoped<IFetchCurrentCompanyHandler, FetchCurrentCompanyHandler>()
    .AddScoped<IUpdateCompanyHandler, UpdateCompanyHandler>();

builder.Services.AddTransient<ExceptionHandlingMiddleware>();
builder.Services.AddTransient<IPredictionHttpService, PredictionHttpService>();

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(JwtOptionsProvider.GetProvider(builder.Configuration));

var app = builder.Build();
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseSwagger();
app.UseSwaggerUI();
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
