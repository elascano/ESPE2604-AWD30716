using Microsoft.EntityFrameworkCore;
using TaxProblem.Web.Models;

namespace TaxProblem.Web.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<Product> Products { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Mapeo de tabla productos con PostgreSQL
        modelBuilder.Entity<Product>(entity =>
        {
            entity.ToTable("products");
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Id)
                .HasColumnName("id")
                .ValueGeneratedOnAdd();

            entity.Property(e => e.Name)
                .HasColumnName("name")
                .HasColumnType("VARCHAR(150)")
                .IsRequired();

            entity.Property(e => e.Quantity)
                .HasColumnName("quantity")
                .HasColumnType("INT");

            entity.Property(e => e.Price)
                .HasColumnName("price")
                .HasColumnType("NUMERIC(10,2)");

            entity.Property(e => e.Subtotal)
                .HasColumnName("subtotal")
                .HasColumnType("NUMERIC(10,2)");

            entity.Property(e => e.IVA)
                .HasColumnName("iva")
                .HasColumnType("NUMERIC(10,2)");

            entity.Property(e => e.Total)
                .HasColumnName("total")
                .HasColumnType("NUMERIC(10,2)");

            entity.Property(e => e.CreatedAt)
                .HasColumnName("created_at")
                .HasColumnType("TIMESTAMP")
                .HasDefaultValueSql("NOW()");
        });
    }
}
