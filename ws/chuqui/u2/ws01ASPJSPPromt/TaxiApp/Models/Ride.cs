using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace TaxiApp.Models;

public class Ride
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    public string Origin { get; set; } = null!;
    public string Destination { get; set; } = null!;
    public decimal Price { get; set; }
    
    public DateTime Date { get; set; } = DateTime.Now;
}