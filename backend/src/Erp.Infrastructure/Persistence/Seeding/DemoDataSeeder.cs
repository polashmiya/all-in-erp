using Erp.Core.Authorization;
using Erp.Core.Domain.Identity;
using Erp.Core.Domain.Tenancy;
using Erp.Core.Security;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Erp.Infrastructure.Persistence.Seeding;

/// <summary>
/// Idempotent demo data: the Panel super admin, "Demo Pharma Ltd" with Dhaka and Chattogram depots,
/// Administrator / Viewer roles and a primary ERP admin with access to both depots.
/// Every lookup is by natural key, so re-running only fills in what is missing.
/// </summary>
public sealed class DemoDataSeeder(
    ErpDbContext db,
    IPasswordHasher hasher,
    PermissionCatalog catalog,
    IOptions<SeedOptions> options,
    ILogger<DemoDataSeeder> logger)
{
    public const string AccountCode = "DEMO-PHARMA";
    public const string AdministratorRole = "Administrator";
    public const string ViewerRole = "Viewer";

    private static readonly (string Code, string Name)[] Units = [("DHK", "Dhaka Depot"), ("CTG", "Chattogram Depot")];

    public async Task SeedAsync(CancellationToken cancellationToken = default)
    {
        var seed = options.Value;

        await EnsurePanelAdminAsync(seed.PanelAdmin, cancellationToken);

        var account = await EnsureAccountAsync(cancellationToken);
        var units = await EnsureBusinessUnitsAsync(account, cancellationToken);
        var administrator = await EnsureRoleAsync(account, AdministratorRole, "Full access to every feature", catalog.Codes, cancellationToken);
        await EnsureRoleAsync(
            account,
            ViewerRole,
            "Read-only access with export",
            catalog.All.Where(p => p.Code.Action is "view" or "export").Select(p => p.Code.Value).ToList(),
            cancellationToken);
        await EnsureErpAdminAsync(seed.ErpAdmin, account, units, administrator, cancellationToken);

        await db.SaveChangesAsync(cancellationToken);
    }

    private async Task EnsurePanelAdminAsync(SeedUserOptions seed, CancellationToken ct)
    {
        var email = Require(seed, "Seed:PanelAdmin");
        if (await db.PanelUsers.AnyAsync(u => u.Email == email, ct)) return;

        db.PanelUsers.Add(new PanelUser
        {
            Email = email,
            FullName = seed.FullName,
            PasswordHash = hasher.Hash(seed.Password),
            Role = PanelRole.SuperAdmin,
        });
        logger.LogInformation("Seeded Panel super admin {Email}", email);
    }

    private async Task<Account> EnsureAccountAsync(CancellationToken ct)
    {
        var account = await db.Accounts.SingleOrDefaultAsync(a => a.Code == AccountCode, ct);
        if (account is not null) return account;

        account = new Account { Code = AccountCode, Name = "Demo Pharma Ltd" };
        db.Accounts.Add(account);
        logger.LogInformation("Seeded account {Account}", account.Name);
        return account;
    }

    private async Task<List<BusinessUnit>> EnsureBusinessUnitsAsync(Account account, CancellationToken ct)
    {
        var existing = await db.BusinessUnits.IgnoreQueryFilters().Where(b => b.AccountId == account.Id).ToListAsync(ct);

        foreach (var (code, name) in Units.Where(u => existing.All(e => e.Code != u.Code)))
        {
            var unit = new BusinessUnit { AccountId = account.Id, Code = code, Name = name };
            db.BusinessUnits.Add(unit);
            existing.Add(unit);
        }

        return existing.Where(e => Units.Any(u => u.Code == e.Code)).ToList();
    }

    private async Task<Role> EnsureRoleAsync(
        Account account, string name, string description, IReadOnlyCollection<string> permissions, CancellationToken ct)
    {
        var role = await db.Roles.IgnoreQueryFilters()
            .Include(r => r.Permissions)
            .SingleOrDefaultAsync(r => r.AccountId == account.Id && r.Name == name, ct);

        if (role is null)
        {
            role = new Role { AccountId = account.Id, Name = name, Description = description, IsSystem = true };
            db.Roles.Add(role);
        }

        // Keep system roles in step with the catalog as modules add permissions.
        foreach (var code in permissions.Where(code => role.Permissions.All(p => p.PermissionCode != code)))
        {
            role.Permissions.Add(new RolePermission { PermissionCode = code });
        }

        return role;
    }

    private async Task EnsureErpAdminAsync(
        SeedUserOptions seed, Account account, List<BusinessUnit> units, Role role, CancellationToken ct)
    {
        var email = Require(seed, "Seed:ErpAdmin");
        var user = await db.ErpUsers.IgnoreQueryFilters()
            .Include(u => u.BusinessUnits)
            .SingleOrDefaultAsync(u => u.Email == email, ct);

        if (user is null)
        {
            user = new ErpUser
            {
                AccountId = account.Id,
                Email = email,
                FullName = seed.FullName,
                PasswordHash = hasher.Hash(seed.Password),
                IsPrimaryAdmin = true,
            };
            db.ErpUsers.Add(user);
            logger.LogInformation("Seeded ERP admin {Email}", email);
        }

        foreach (var unit in units.Where(unit => user.BusinessUnits.All(x => x.BusinessUnitId != unit.Id)))
        {
            user.BusinessUnits.Add(new UserBusinessUnit { AccountId = account.Id, BusinessUnitId = unit.Id, Role = role });
        }
    }

    private static string Require(SeedUserOptions seed, string section)
    {
        if (string.IsNullOrWhiteSpace(seed.Email) || string.IsNullOrWhiteSpace(seed.Password))
        {
            throw new InvalidOperationException($"Demo seeding is enabled but {section}:Email/Password is not configured.");
        }

        return seed.Email.Trim().ToLowerInvariant();
    }
}
