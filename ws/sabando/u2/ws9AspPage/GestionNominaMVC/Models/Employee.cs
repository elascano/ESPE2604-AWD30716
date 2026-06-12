using Postgrest.Attributes;
using Postgrest.Models;
using System;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace GestionNominaMVC.Models
{
    [Table("employees")]
    public class Employee : BaseModel
    {
        [PrimaryKey("id", false)] // false means Supabase auto-generates the ID
        public long Id { get; set; }

        [Column("first_name")]
        [Required(ErrorMessage = "First name is required")]
        [Display(Name = "First Name")]
        public string FirstName { get; set; }

        [Column("last_name")]
        [Required(ErrorMessage = "Last name is required")]
        [Display(Name = "Last Name")]
        public string LastName { get; set; }

        [Column("national_id")]
        [Required(ErrorMessage = "National ID is required")]
        [Display(Name = "National ID")]
        public string NationalId { get; set; }

        [Column("email")]
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        [Display(Name = "Email")]
        public string Email { get; set; }

        [Column("phone_number")]
        [Display(Name = "Phone Number")]
        public string PhoneNumber { get; set; }

        [Column("date_of_birth")]
        [Required(ErrorMessage = "Date of birth is required")]
        [DataType(DataType.Date)]
        [Display(Name = "Date of Birth")]
        public DateTime DateOfBirth { get; set; }

        [Column("department")]
        [Required(ErrorMessage = "Department is required")]
        [Display(Name = "Department")]
        public string Department { get; set; }

        [Column("job_title")]
        [Required(ErrorMessage = "Job title is required")]
        [Display(Name = "Job Title")]
        public string JobTitle { get; set; }

        [Column("hire_date")]
        [Required(ErrorMessage = "Hire date is required")]
        [DataType(DataType.Date)]
        [Display(Name = "Hire Date")]
        public DateTime HireDate { get; set; }

        [Column("base_salary")]
        [Required(ErrorMessage = "Base salary is required")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Salary must be greater than 0")]
        [Display(Name = "Base Salary")]
        public decimal BaseSalary { get; set; }

        [Column("bonuses")]
        [Range(0, double.MaxValue, ErrorMessage = "Negative values are not allowed")]
        [Display(Name = "Bonuses")]
        public decimal Bonuses { get; set; }

        [Column("deductions")]
        [Range(0, double.MaxValue, ErrorMessage = "Negative values are not allowed")]
        [Display(Name = "Deductions (Taxes/Retentions)")]
        public decimal Deductions { get; set; }



        // CALCULATED PROPERTY (Not stored in DB, calculated on the fly)
        [JsonIgnore]
        [Display(Name = "Net Salary")]
        public decimal NetSalary => (BaseSalary + Bonuses) - Deductions;
    }
}