using ErazoStudentNames.Models;
using MongoDB.Driver;

namespace ErazoStudentNames.Services;

public class StudentService
{
    private readonly IMongoCollection<Student> _students;

    public StudentService(IConfiguration configuration)
    {
        var mongoUri = Environment.GetEnvironmentVariable("MONGODB_URI")
            ?? configuration["MongoDb:ConnectionString"];

        if (string.IsNullOrWhiteSpace(mongoUri))
        {
            throw new InvalidOperationException("MONGODB_URI is required.");
        }

        var databaseName = Environment.GetEnvironmentVariable("MONGODB_DATABASE")
            ?? configuration["MongoDb:DatabaseName"]
            ?? "student_grades";

        var client = new MongoClient(mongoUri);
        var database = client.GetDatabase(databaseName);
        _students = database.GetCollection<Student>("students");
    }

    public async Task<IReadOnlyList<Student>> GetAllAsync()
    {
        return await _students
            .Find(FilterDefinition<Student>.Empty)
            .SortByDescending(student => student.CreatedAt)
            .ToListAsync();
    }

    public async Task CreateAsync(Student student)
    {
        student.CreatedAt = DateTime.UtcNow;
        await _students.InsertOneAsync(student);
    }
}
