using GestionNominaMVC.Models;
using System.Collections.Generic;
using System.Linq;

namespace GestionNominaMVC.ViewModels
{
    public class PayrollViewModel
    {
        public List<Employee> Employees { get; set; } = new List<Employee>();

        public decimal TotalPayrollCost => Employees.Sum(e => e.NetSalary);
        
        public decimal TotalBaseSalary => Employees.Sum(e => e.BaseSalary);
        
        public decimal TotalBonuses => Employees.Sum(e => e.Bonuses);
        
        public decimal TotalDeductions => Employees.Sum(e => e.Deductions);
    }
}
