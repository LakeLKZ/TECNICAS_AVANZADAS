using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<Banner> Banners { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // FORZAR el mapeo explícito de TODOS los enums
            modelBuilder.Entity<Banner>()
                .Property(e => e.Position)
                .HasColumnType("position");

            modelBuilder.Entity<Banner>()
                .Property(e => e.RenewalType)
                .HasColumnType("renewaltype");

            modelBuilder.Entity<Banner>()
                .Property(e => e.AutoRenewalPeriod)
                .HasColumnType("renewalperiod");

            // Fechas sin zona horaria
            modelBuilder.Entity<Banner>()
                .Property(e => e.StartDate)
                .HasColumnType("timestamp without time zone");

            modelBuilder.Entity<Banner>()
                .Property(e => e.EndDate)
                .HasColumnType("timestamp without time zone");
        }
    }
}