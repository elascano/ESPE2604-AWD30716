using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TaxProblem.Web.Models;

[Table("products")]
public class Product
{
    [Key]
    [Column("id")]
    public long Id { get; set; }

    [Required(ErrorMessage = "El nombre del producto es requerido")]
    [StringLength(150, MinimumLength = 3, ErrorMessage = "El nombre debe tener entre 3 y 150 caracteres")]
    [Column("name")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "La cantidad es requerida")]
    [Range(1, int.MaxValue, ErrorMessage = "La cantidad debe ser mayor a 0")]
    [Column("quantity")]
    public int Quantity { get; set; }

    [Required(ErrorMessage = "El precio es requerido")]
    [Range(0.01, double.MaxValue, ErrorMessage = "El precio debe ser mayor a 0")]
    [Column("price")]
    [DisplayFormat(DataFormatString = "{0:F2}")]
    public decimal Price { get; set; }

    [Column("subtotal")]
    [DisplayFormat(DataFormatString = "{0:F2}")]
    public decimal Subtotal { get; set; }

    [Column("iva")]
    [DisplayFormat(DataFormatString = "{0:F2}")]
    public decimal IVA { get; set; }

    [Column("total")]
    [DisplayFormat(DataFormatString = "{0:F2}")]
    public decimal Total { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified);
}
