using Erp.Api.Endpoints;
using Erp.Api.Hosting;
using Erp.Infrastructure;
using Scalar.AspNetCore;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSerilog((services, logger) => logger
    .ReadFrom.Configuration(builder.Configuration)
    .ReadFrom.Services(services)
    .Enrich.FromLogContext());

builder.Services.AddProblemDetails();
builder.Services.AddErpOpenApi();
builder.Services.AddFrontendCors(builder.Configuration);
builder.Services.AddInfrastructure(builder.Configuration);

var app = builder.Build();

app.UseSerilogRequestLogging();
app.UseExceptionHandler();
app.UseStatusCodePages();
app.UseCors(CorsSetup.PolicyName);

app.MapOpenApi();
app.MapScalarApiReference("/docs", options => options
    .WithTitle("myErp API")
    .WithDefaultHttpClient(ScalarTarget.JavaScript, ScalarClient.Fetch));

app.MapHealthEndpoints();
app.MapSystemEndpoints();
app.MapPanelApi();
app.MapErpApi();

app.Run();

/// <summary>Exposed for WebApplicationFactory in integration tests.</summary>
public partial class Program;
