namespace StudentPortal.Models
{
    public class DashboardViewModel
    {
        public List<Student> Students { get; set; } = new();
        public double CourseAverage { get; set; }
        public Student? BestStudent { get; set; }
        public Student? WorstStudent { get; set; }
    }
}