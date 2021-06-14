using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace JournalApi.Models
{
    public class JournalEntry
    {
        [BsonId]
        [BsonIgnoreIfDefault]
        public ObjectId InternalId { get; set; }
        public string? EntryText {get; set;}
        public long? UserId {get; set;}
        public string? Date {get; set;}
        public bool? IsImportant {get; set;}
    }
}