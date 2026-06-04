using System.ComponentModel.DataAnnotations;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ErazoStudentNames.Models;

public class Student
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [Required]
    [Display(Name = "First name")]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [Display(Name = "Last name")]
    public string LastName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [Display(Name = "Postal code")]
    public string PostalCode { get; set; } = string.Empty;

    [Required]
    public string City { get; set; } = string.Empty;

    [Required]
    [Display(Name = "Phone number")]
    public string PhoneNumber { get; set; } = string.Empty;

    [Required]
    [Display(Name = "Course")]
    public string CourseName { get; set; } = string.Empty;

    [Required]
    [Range(0, 20)]
    [Display(Name = "Unit 1")]
    public decimal UnitOneGrade { get; set; }

    [Required]
    [Range(0, 20)]
    [Display(Name = "Unit 2")]
    public decimal UnitTwoGrade { get; set; }

    [Required]
    [Range(0, 20)]
    [Display(Name = "Unit 3")]
    public decimal UnitThreeGrade { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [BsonIgnore]
    public decimal Mean => Math.Round((UnitOneGrade + UnitTwoGrade + UnitThreeGrade) / 3, 2);

    [BsonIgnore]
    public bool Passed => Mean >= 14;
}
