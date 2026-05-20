using System.ComponentModel.DataAnnotations;

namespace SchoolGrades.Models;

public class EstudianteCalificacionViewModel
{
    // Student fields
    [Required(ErrorMessage = "The name is required")]
    [StringLength(150)]
    [Display(Name = "Full name")]
    public string Nombre { get; set; } = string.Empty;

    [Required(ErrorMessage = "The ID number is required")]
    [StringLength(20)]
    [Display(Name = "ID number")]
    public string Cedula { get; set; } = string.Empty;

    [Required(ErrorMessage = "The email is required")]
    [EmailAddress(ErrorMessage = "Invalid email address")]
    [StringLength(200)]
    [Display(Name = "Email address")]
    public string Correo { get; set; } = string.Empty;

    // Grade fields
    [Required(ErrorMessage = "Grade 1 is required")]
    [Range(1, 10, ErrorMessage = "The grade must be between 1 and 10")]
    [Display(Name = "Grade 1")]
    public decimal Nota1 { get; set; }

    [Required(ErrorMessage = "Grade 2 is required")]
    [Range(1, 10, ErrorMessage = "The grade must be between 1 and 10")]
    [Display(Name = "Grade 2")]
    public decimal Nota2 { get; set; }

    [Required(ErrorMessage = "Grade 3 is required")]
    [Range(1, 10, ErrorMessage = "The grade must be between 1 and 10")]
    [Display(Name = "Grade 3")]
    public decimal Nota3 { get; set; }
}
