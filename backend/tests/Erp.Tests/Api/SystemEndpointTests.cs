using System.Net;
using System.Net.Http.Json;
using Erp.Api.Endpoints;
using Erp.Tests.Infrastructure;

namespace Erp.Tests.Api;

[Collection(ApiCollection.Name)]
public sealed class SystemEndpointTests(ApiFactory factory)
{
    private readonly HttpClient _client = factory.CreateClient();

    [Fact]
    public async Task Health_reports_healthy_database()
    {
        var response = await _client.GetAsync("/health");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<HealthResponse>();
        Assert.NotNull(body);
        Assert.Equal("Healthy", body.Status);
        var database = Assert.Single(body.Checks, c => c.Name == "database");
        Assert.Equal("Healthy", database.Status);
    }

    [Fact]
    public async Task Api_info_returns_name_version_and_environment()
    {
        var info = await _client.GetFromJsonAsync<ApiInfo>("/api/info");

        Assert.NotNull(info);
        Assert.Equal("myErp API", info.Name);
        Assert.False(string.IsNullOrWhiteSpace(info.Version));
        Assert.Equal("Development", info.Environment);
    }

    [Fact]
    public async Task OpenApi_document_is_served()
    {
        var json = await _client.GetStringAsync("/openapi/v1.json");

        Assert.Contains("\"myErp API\"", json);
        Assert.Contains("\"GetHealth\"", json);
        Assert.Contains("\"GetApiInfo\"", json);
    }

    [Fact]
    public async Task Scalar_docs_page_is_served()
    {
        var response = await _client.GetAsync("/docs");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal("text/html", response.Content.Headers.ContentType?.MediaType);
    }

    [Theory]
    [InlineData("http://localhost:5173")]
    [InlineData("http://localhost:5174")]
    public async Task Cors_allows_the_dev_frontends(string origin)
    {
        var response = await SendPreflightAsync(origin);

        Assert.True(response.Headers.TryGetValues("Access-Control-Allow-Origin", out var values));
        Assert.Equal(origin, Assert.Single(values));
    }

    [Fact]
    public async Task Cors_rejects_unknown_origins()
    {
        var response = await SendPreflightAsync("http://evil.example");

        Assert.False(response.Headers.Contains("Access-Control-Allow-Origin"));
    }

    private Task<HttpResponseMessage> SendPreflightAsync(string origin)
    {
        var request = new HttpRequestMessage(HttpMethod.Options, "/api/info");
        request.Headers.Add("Origin", origin);
        request.Headers.Add("Access-Control-Request-Method", "GET");
        return _client.SendAsync(request);
    }
}
