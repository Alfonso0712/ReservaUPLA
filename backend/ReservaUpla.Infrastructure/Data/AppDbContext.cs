using Microsoft.EntityFrameworkCore;
using ReservaUpla.Domain.Constants;
using ReservaUpla.Domain.Entities;
using ReservaUpla.Domain.Enums;

namespace ReservaUpla.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Usuario> Usuarios => Set<Usuario>();
    public DbSet<Ambiente> Ambientes => Set<Ambiente>();
    public DbSet<Reserva> Reservas => Set<Reserva>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        ConfigurarUsuario(modelBuilder);
        ConfigurarAmbiente(modelBuilder);
        ConfigurarReserva(modelBuilder);
    }

    private static void ConfigurarUsuario(ModelBuilder mb)
    {
        mb.Entity<Usuario>(b =>
        {
            b.ToTable("usuarios", t =>
            {
                t.HasCheckConstraint("CK_usuarios_tema", "tema IN ('claro', 'oscuro')");
                t.HasCheckConstraint("CK_usuarios_tamano_letra", "tamano_letra IN ('pequeno', 'normal', 'grande')");
            });
            b.HasKey(u => u.Id_Usuario);
            b.Property(u => u.Id_Usuario).HasColumnName("id_usuario");
            b.Property(u => u.Nom_Usuario).HasColumnName("nom_usuario").HasMaxLength(ReglasUsuario.MaxLongitudNombre).IsRequired();
            b.Property(u => u.Cor_Usuario).HasColumnName("cor_usuario").HasMaxLength(ReglasUsuario.CorreoMaxLength).IsRequired();
            b.Property(u => u.Has_Usuario).HasColumnName("has_usuario").IsRequired();
            b.Property(u => u.Rol_Usuario).HasColumnName("rol_usuario").HasConversion<string>().HasMaxLength(50).IsRequired();
            b.Property(u => u.Act_Usuario).HasColumnName("act_usuario").IsRequired();
            b.Property(u => u.Tema).HasColumnName("tema").HasMaxLength(20).HasDefaultValue("claro").IsRequired();
            b.Property(u => u.TamanoLetra).HasColumnName("tamano_letra").HasMaxLength(20).HasDefaultValue("normal").IsRequired();

            b.HasIndex(u => u.Cor_Usuario).IsUnique();
        });
    }

    private static void ConfigurarAmbiente(ModelBuilder mb)
    {
        mb.Entity<Ambiente>(b =>
        {
            b.ToTable("ambientes");
            b.HasKey(a => a.Id_Ambiente);
            b.Property(a => a.Id_Ambiente).HasColumnName("id_ambiente");
            b.Property(a => a.Nom_Ambiente).HasColumnName("nom_ambiente").HasMaxLength(100).IsRequired();
            b.Property(a => a.Tip_Ambiente).HasColumnName("tip_ambiente").HasConversion<string>().HasMaxLength(50).IsRequired();
            b.Property(a => a.Cap_Ambiente).HasColumnName("cap_ambiente").IsRequired();
            b.Property(a => a.Ubi_Ambiente).HasColumnName("ubi_ambiente").HasMaxLength(100).IsRequired();
            b.Property(a => a.Est_Ambiente).HasColumnName("est_ambiente").HasConversion<string>().HasMaxLength(30).IsRequired();
            b.Property(a => a.Idr_Ambiente).HasColumnName("idr_ambiente");

            b.HasOne<Usuario>()
             .WithMany()
             .HasForeignKey(a => a.Idr_Ambiente)
             .OnDelete(DeleteBehavior.SetNull);
        });
    }

    private static void ConfigurarReserva(ModelBuilder mb)
    {
        mb.Entity<Reserva>(b =>
        {
            b.ToTable("reservas");
            b.HasKey(r => r.Id_Reserva);
            b.Property(r => r.Id_Reserva).HasColumnName("id_reserva");
            b.Property(r => r.Fec_Reserva).HasColumnName("fec_reserva").IsRequired();
            b.Property(r => r.Hin_Reserva).HasColumnName("hin_reserva").IsRequired();
            b.Property(r => r.Hfi_Reserva).HasColumnName("hfi_reserva").IsRequired();
            b.Property(r => r.Mot_Reserva).HasColumnName("mot_reserva").IsRequired();
            b.Property(r => r.Est_Reserva).HasColumnName("est_reserva").HasConversion<string>().HasMaxLength(30).IsRequired();
            b.Property(r => r.Idu_Reserva).HasColumnName("idu_reserva").IsRequired();
            b.Property(r => r.Ida_Reserva).HasColumnName("ida_reserva").IsRequired();
            b.Property(r => r.Fre_Reserva).HasColumnName("fre_reserva").IsRequired();

            b.HasOne<Usuario>()
             .WithMany()
             .HasForeignKey(r => r.Idu_Reserva)
             .OnDelete(DeleteBehavior.Restrict);

            b.HasOne<Ambiente>()
             .WithMany()
             .HasForeignKey(r => r.Ida_Reserva)
             .OnDelete(DeleteBehavior.Restrict);

            b.HasIndex(r => new { r.Ida_Reserva, r.Fec_Reserva, r.Est_Reserva });
        });
    }
}
