using Erp.Core.Domain.Tenancy;
using Erp.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Erp.Api.Panel.Accounts;

/// <summary>Which ERP features (menus) an account has. Feature codes are matched case-insensitively.</summary>
public sealed class AccountFeatureService(ErpDbContext db)
{
    public const string ErrorKey = "featureCodes";

    /// <summary>Feature ids for the codes, or the codes that do not name an active feature.</summary>
    public async Task<(List<Guid> Ids, List<string> Unknown)> ResolveAsync(IEnumerable<string> codes, CancellationToken cancellationToken)
    {
        var requested = codes.Select(c => c.Trim().ToLowerInvariant()).Where(c => c.Length > 0).Distinct().ToList();
        var found = await db.ErpFeatures
            .Where(f => f.IsActive && requested.Contains(f.Code))
            .Select(f => new { f.Id, f.Code })
            .ToListAsync(cancellationToken);

        var unknown = requested.Except(found.Select(f => f.Code), StringComparer.OrdinalIgnoreCase).ToList();
        return (found.Select(f => f.Id).ToList(), unknown);
    }

    public static string UnknownMessage(IEnumerable<string> unknown) => $"Unknown ERP feature(s): {string.Join(", ", unknown)}.";

    /// <summary>Makes the account's features exactly <paramref name="featureIds"/> (adds and removes as needed).</summary>
    public async Task ReplaceAsync(Guid accountId, IReadOnlyCollection<Guid> featureIds, CancellationToken cancellationToken)
    {
        var current = await db.AccountFeatures.AcrossTenants().Where(af => af.AccountId == accountId).ToListAsync(cancellationToken);

        db.AccountFeatures.RemoveRange(current.Where(af => !featureIds.Contains(af.FeatureId)));
        db.AccountFeatures.AddRange(featureIds
            .Where(id => current.All(af => af.FeatureId != id))
            .Select(id => new AccountFeature { AccountId = accountId, FeatureId = id }));
    }

    public async Task<List<string>> CodesAsync(Guid accountId, CancellationToken cancellationToken) =>
        await db.AccountFeatures.AcrossTenants()
            .Where(af => af.AccountId == accountId)
            .OrderBy(af => af.Feature!.Code)
            .Select(af => af.Feature!.Code)
            .ToListAsync(cancellationToken);
}
