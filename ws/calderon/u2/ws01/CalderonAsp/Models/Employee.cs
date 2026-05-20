namespace EmployeeManagement.Models
{
    public class Employee
    {
        public string? Id { get; set; }
        public string? Name { get; set; }
        public string? Address { get; set; }
        public string? Cellphone { get; set; }
        public string? Email { get; set; }
        public decimal Salary { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
