using Erp.Core.Domain;
using Erp.Core.Tenancy;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace Erp.Infrastructure.Persistence;

/// <summary>Stamps CreatedAt/By and UpdatedAt/By on every <see cref="BaseEntity"/> being saved.</summary>
public sealed class AuditingInterceptor(ICurrentContext current, TimeProvider clock) : SaveChangesInterceptor
{
    public override InterceptionResult<int> SavingChanges(DbContextEventData eventData, InterceptionResult<int> result)
    {
        Stamp(eventData.Context);
        return result;
    }

    public override ValueTask<InterceptionResult<int>> SavingChangesAsync(
        DbContextEventData eventData, InterceptionResult<int> result, CancellationToken cancellationToken = default)
    {
        Stamp(eventData.Context);
        return ValueTask.FromResult(result);
    }

    private void Stamp(DbContext? context)
    {
        if (context is null) return;

        var now = clock.GetUtcNow();
        var userId = current.UserId;

        foreach (var entry in context.ChangeTracker.Entries<BaseEntity>())
        {
            switch (entry.State)
            {
                case EntityState.Added:
                    entry.Entity.CreatedAt = now;
                    entry.Entity.CreatedBy ??= userId;
                    break;
                case EntityState.Modified:
                    entry.Entity.UpdatedAt = now;
                    entry.Entity.UpdatedBy = userId;
                    break;
            }
        }

        var utcNow = now.UtcDateTime;
        foreach (var entry in context.ChangeTracker.Entries<IAuditedRecord>())
        {
            switch (entry.State)
            {
                case EntityState.Added:
                    entry.Entity.CreatedAt = utcNow;
                    entry.Entity.CreatedById ??= userId;
                    entry.Entity.TransactionDate ??= utcNow;
                    break;
                case EntityState.Modified:
                    entry.Entity.ModifiedAt = utcNow;
                    entry.Entity.ModifiedById = userId;
                    break;
            }
        }
    }
}
