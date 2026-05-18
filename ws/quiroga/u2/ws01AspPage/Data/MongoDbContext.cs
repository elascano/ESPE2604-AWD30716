using MongoDB.Driver;
using StudentPortal.Models;
using Microsoft.Extensions.Configuration;

namespace StudentPortal.Data
{
    public class MongoDbContext
    {
        private readonly IMongoDatabase _database;

        public MongoDbContext(IConfiguration configuration)
        {
            // Retrieve the connection string from appsettings.json
            var connectionString = configuration.GetConnectionString("MongoDb");
            
            if (string.IsNullOrEmpty(connectionString))
            {
                throw new ArgumentNullException(nameof(connectionString), 
                    "The MongoDB connection string 'MongoDb' was not found in appsettings.json.");
            }

            // Initialize the MongoDB Client
            var client = new MongoClient(connectionString);
            
            // Connect to the specific database (it will be created automatically if it doesn't exist)
            _database = client.GetDatabase("UniversityDB");
        }

        // Expose the Students collection to the Controller
        public IMongoCollection<Student> Students => _database.GetCollection<Student>("Students");
    }
}