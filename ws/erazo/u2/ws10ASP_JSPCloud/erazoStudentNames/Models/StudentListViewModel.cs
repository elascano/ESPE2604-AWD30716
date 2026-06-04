namespace ErazoStudentNames.Models;

public class StudentListViewModel
{
    public IReadOnlyList<Student> Students { get; set; } = [];

    public decimal ClassMean => Students.Count == 0
        ? 0
        : Math.Round(Students.Average(student => student.Mean), 2);
}
