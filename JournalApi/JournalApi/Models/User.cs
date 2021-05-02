using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace JournalApi.Models
{
    public class User
    {
        [BsonId]
        public ObjectId InternalId { get; set; }
        public long UserId { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? Password {get; set;}
    }
}