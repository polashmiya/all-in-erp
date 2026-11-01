using Erp.Core.Authorization;
using Erp.Core.Modules;
using Erp.Core.Tenancy;
using Erp.Infrastructure.Persistence;
using Erp.Modules.Inventory;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;

namespace Erp.Tests.Infrastructure;

public sealed record ProbeContext(Guid? UserId, Guid? AccountId, Guid? BusinessUnitId);

/// <summary>
/// Test-only endpoints, mounted through the same <see cref="IErpEndpoints"/> hook feature modules use, so they
/// run behind the real ERP group (audience policy + business-unit filter) and the real RequirePermission.
/// </summary>
internal sealed class ProbeEndpoints : IErpEndpoints
{
    public void Map(IEndpointRouteBuilder erp)
    {
        var probe = erp.MapGroup("/__probe");

        probe.MapGet("/context", (ICurrentContext c) => new ProbeContext(c.UserId, c.AccountId, c.BusinessUnitId));

        probe.MapGet("/view", (ICurrentContext c) => new ProbeContext(c.UserId, c.AccountId, c.BusinessUnitId))
            .RequirePermission(InventoryPermissions.ItemView);

        probe.MapPost("/create", () => TypedResults.NoContent())
            .RequirePermission(InventoryPermissions.ItemCreate);

        // Plain query, no explicit account condition: only the tenant filter limits it.
        probe.MapGet("/business-units", async (ErpDbContext db) =>
            await db.BusinessUnits.OrderBy(b => b.Code).Select(b => b.Code).ToListAsync());
    }
}
