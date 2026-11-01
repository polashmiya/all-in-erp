using Erp.Core.Domain.Tenancy;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Erp.Infrastructure.Persistence.Configurations;

internal sealed class AccountConfiguration : IEntityTypeConfiguration<Account>
{
    public void Configure(EntityTypeBuilder<Account> builder)
    {
        builder.ToTable("Accounts");
        builder.Property(a => a.Code).HasMaxLength(32);
        builder.Property(a => a.Name).HasMaxLength(200);
        builder.HasIndex(a => a.Code).IsUnique();
    }
}

internal sealed class BusinessUnitConfiguration : IEntityTypeConfiguration<BusinessUnit>
{
    public void Configure(EntityTypeBuilder<BusinessUnit> builder)
    {
        builder.ToTable("BusinessUnits");
        builder.Property(b => b.Code).HasMaxLength(32);
        builder.Property(b => b.Name).HasMaxLength(200);
        builder.HasIndex(b => new { b.AccountId, b.Code }).IsUnique();

        builder.HasOne(b => b.Account)
            .WithMany(a => a.BusinessUnits)
            .HasForeignKey(b => b.AccountId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
