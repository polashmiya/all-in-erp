using Erp.Core.Domain.Navigation;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Erp.Infrastructure.Persistence.Configurations;

internal sealed class PanelMenuItemConfiguration : IEntityTypeConfiguration<PanelMenuItem>
{
    public void Configure(EntityTypeBuilder<PanelMenuItem> builder)
    {
        builder.ToTable("PanelMenuItems");
        builder.Property(m => m.Key).HasMaxLength(100);
        builder.Property(m => m.LabelEn).HasMaxLength(100);
        builder.Property(m => m.LabelBn).HasMaxLength(100);
        builder.Property(m => m.Icon).HasMaxLength(50);
        builder.Property(m => m.Path).HasMaxLength(200);
        builder.HasIndex(m => m.Key).IsUnique();

        builder.HasOne(m => m.Parent)
            .WithMany(m => m.Children)
            .HasForeignKey(m => m.ParentId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
