using Erp.Core.Domain.Identity;
using Erp.Core.Domain.Tenancy;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Erp.Infrastructure.Persistence.Configurations;

internal sealed class PanelUserConfiguration : IEntityTypeConfiguration<PanelUser>
{
    public void Configure(EntityTypeBuilder<PanelUser> builder)
    {
        builder.ToTable("PanelUsers");
        builder.Property(u => u.Email).HasMaxLength(256);
        builder.Property(u => u.FullName).HasMaxLength(200);
        builder.Property(u => u.PasswordHash).HasMaxLength(100);
        builder.Property(u => u.Role).HasConversion<string>().HasMaxLength(32);
        builder.HasIndex(u => u.Email).IsUnique();
    }
}

internal sealed class ErpUserConfiguration : IEntityTypeConfiguration<ErpUser>
{
    public void Configure(EntityTypeBuilder<ErpUser> builder)
    {
        builder.ToTable("ErpUsers");
        builder.Property(u => u.Email).HasMaxLength(256);
        builder.Property(u => u.FullName).HasMaxLength(200);
        builder.Property(u => u.PasswordHash).HasMaxLength(100);
        builder.HasIndex(u => u.Email).IsUnique();

        builder.HasOne(u => u.Account)
            .WithMany()
            .HasForeignKey(u => u.AccountId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne<BusinessUnit>()
            .WithMany()
            .HasForeignKey(u => u.LastBusinessUnitId)
            .OnDelete(DeleteBehavior.NoAction);
    }
}

internal sealed class UserBusinessUnitConfiguration : IEntityTypeConfiguration<UserBusinessUnit>
{
    public void Configure(EntityTypeBuilder<UserBusinessUnit> builder)
    {
        builder.ToTable("UserBusinessUnits");
        builder.HasIndex(x => new { x.UserId, x.BusinessUnitId }).IsUnique();

        builder.HasOne<Account>().WithMany().HasForeignKey(x => x.AccountId).OnDelete(DeleteBehavior.Restrict);
        builder.HasOne(x => x.User).WithMany(u => u.BusinessUnits).HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Cascade);
        builder.HasOne(x => x.BusinessUnit).WithMany().HasForeignKey(x => x.BusinessUnitId).OnDelete(DeleteBehavior.Cascade);
        builder.HasOne(x => x.Role).WithMany().HasForeignKey(x => x.RoleId).OnDelete(DeleteBehavior.Restrict);
    }
}

internal sealed class RoleConfiguration : IEntityTypeConfiguration<Role>
{
    public void Configure(EntityTypeBuilder<Role> builder)
    {
        builder.ToTable("Roles");
        builder.Property(r => r.Name).HasMaxLength(100);
        builder.Property(r => r.Description).HasMaxLength(500);
        builder.HasIndex(r => new { r.AccountId, r.Name }).IsUnique();

        builder.HasOne<Account>().WithMany().HasForeignKey(r => r.AccountId).OnDelete(DeleteBehavior.Restrict);
        builder.HasMany(r => r.Permissions).WithOne(p => p.Role).HasForeignKey(p => p.RoleId).OnDelete(DeleteBehavior.Cascade);
    }
}

internal sealed class RolePermissionConfiguration : IEntityTypeConfiguration<RolePermission>
{
    public void Configure(EntityTypeBuilder<RolePermission> builder)
    {
        builder.ToTable("RolePermissions");
        builder.HasKey(p => new { p.RoleId, p.PermissionCode });
        builder.Property(p => p.PermissionCode).HasMaxLength(150);
        builder.HasOne<Permission>().WithMany().HasForeignKey(p => p.PermissionCode).OnDelete(DeleteBehavior.Cascade);
    }
}

internal sealed class PermissionConfiguration : IEntityTypeConfiguration<Permission>
{
    public void Configure(EntityTypeBuilder<Permission> builder)
    {
        builder.ToTable("Permissions");
        builder.HasKey(p => p.Code);
        builder.Property(p => p.Code).HasMaxLength(150);
        builder.Property(p => p.Module).HasMaxLength(50);
        builder.Property(p => p.Feature).HasMaxLength(50);
        builder.Property(p => p.Action).HasMaxLength(50);
        builder.Property(p => p.Description).HasMaxLength(200);
    }
}
