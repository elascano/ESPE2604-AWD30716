using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace StudentPortal.Models
{
    public class Student
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [Required]
        [BsonElement("StudentId")]
        public string StudentId { get; set; } = string.Empty;

        [Required]
        [BsonElement("FirstName")]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [BsonElement("LastName")]
        public string LastName { get; set; } = string.Empty;

        // 5 Subjects
        public double Math { get; set; }
        public double Science { get; set; }
        public double History { get; set; }
        public double English { get; set; }
        public double Programming { get; set; }

        [BsonElement("Average")]
        public double Average { get; set; }
    }
}