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
        builder.Property(a => a.Email).HasMaxLength(256);
        builder.Property(a => a.Phone).HasMaxLength(32);
        builder.Property(a => a.Website).HasMaxLength(200);
        builder.Property(a => a.Industry).HasMaxLength(100);
        builder.Property(a => a.TaxId).HasMaxLength(50);
        builder.Property(a => a.Address).HasMaxLength(500);
        builder.Property(a => a.City).HasMaxLength(100);
        builder.Property(a => a.Country).HasMaxLength(2).IsFixedLength();
        builder.Property(a => a.BaseCurrency).HasMaxLength(3).IsFixedLength().HasDefaultValue("BDT");
        builder.Property(a => a.TimeZone).HasMaxLength(64).HasDefaultValue("Asia/Dhaka");
        builder.HasIndex(a => a.Code).IsUnique();
        builder.HasIndex(a => a.Name);
    }
}

internal sealed class BusinessUnitConfiguration : IEntityTypeConfiguration<BusinessUnit>
{
    public void Configure(EntityTypeBuilder<BusinessUnit> builder)
    {
        builder.ToTable("BusinessUnits");
        builder.Property(b => b.Code).HasMaxLength(32);
        builder.Property(b => b.Name).HasMaxLength(200);
        builder.Property(b => b.Email).HasMaxLength(256);
        builder.Property(b => b.Phone).HasMaxLength(32);
        builder.Property(b => b.Address).HasMaxLength(500);
        builder.HasIndex(b => new { b.AccountId, b.Code }).IsUnique();

        builder.HasOne(b => b.Account)
            .WithMany(a => a.BusinessUnits)
            .HasForeignKey(b => b.AccountId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

internal sealed class OfficeConfiguration : IEntityTypeConfiguration<Office>
{
    public void Configure(EntityTypeBuilder<Office> builder)
    {
        builder.ToTable("Offices");
        builder.Property(o => o.Code).HasMaxLength(32);
        builder.Property(o => o.Name).HasMaxLength(200);
        builder.Property(o => o.Email).HasMaxLength(256);
        builder.Property(o => o.Phone).HasMaxLength(32);
        builder.Property(o => o.Address).HasMaxLength(500);
        builder.HasIndex(o => new { o.BusinessUnitId, o.Code }).IsUnique();

        builder.HasOne<Account>().WithMany().HasForeignKey(o => o.AccountId).OnDelete(DeleteBehavior.Restrict);
        builder.HasOne(o => o.BusinessUnit)
            .WithMany(b => b.Offices)
            .HasForeignKey(o => o.BusinessUnitId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

internal sealed class WarehouseConfiguration : IEntityTypeConfiguration<Warehouse>
{
    public void Configure(EntityTypeBuilder<Warehouse> builder)
    {
        builder.ToTable("Warehouses");
        builder.Property(w => w.Code).HasMaxLength(32);
        builder.Property(w => w.Name).HasMaxLength(200);
        builder.Property(w => w.Address).HasMaxLength(500);
        builder.HasIndex(w => new { w.BusinessUnitId, w.Code }).IsUnique();

        builder.HasOne<Account>().WithMany().HasForeignKey(w => w.AccountId).OnDelete(DeleteBehavior.Restrict);
        builder.HasOne(w => w.BusinessUnit)
            .WithMany(b => b.Warehouses)
            .HasForeignKey(w => w.BusinessUnitId)
            .OnDelete(DeleteBehavior.Restrict);
        builder.HasOne(w => w.Office)
            .WithMany(o => o.Warehouses)
            .HasForeignKey(w => w.OfficeId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
