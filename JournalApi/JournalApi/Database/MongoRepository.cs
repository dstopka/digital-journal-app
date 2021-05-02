using System.Diagnostics.CodeAnalysis;
using MongoDB.Driver;

using JournalApi.Models;

namespace JournalApi.Database
{
    [ExcludeFromCodeCoverage]
    public class MongoRepository
    {
        private readonly IMongoDatabase _db;        
        
        public MongoRepository(IDbConfig config)
        {
            var client = new MongoClient(config.ConnectionString);
            _db = client.GetDatabase(config.Database);
        }        
        public IMongoCollection<User> Users => _db.GetCollection<User>("Users");
    }
}