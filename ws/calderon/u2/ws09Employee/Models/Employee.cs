using System.ComponentModel.DataAnnotations;

namespace EmployeeApp.Models
{
    public class Employee
    {
        public int Id { get; set; }

        [Required]
        public string EmployeeId { get; set; }

        public string Name { get; set; }

        public string Address { get; set; }

        public string Cellphone { get; set; }

        public string Email { get; set; }

        public decimal Salary { get; set; }
    }
}