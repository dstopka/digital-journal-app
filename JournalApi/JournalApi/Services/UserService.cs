using System.Collections.Generic;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Driver;
using BC = BCrypt.Net.BCrypt;

using JournalApi.Database;
using JournalApi.Models;
using JournalApi.Services.Abstract;

namespace JournalApi.Services 
{
    public class UserService : IUserService
    {
        private readonly MongoRepository _repository;

        public UserService(IDbConfig config) => _repository = new MongoRepository(config);

        public async Task<IEnumerable<User>> GetAllUsers() 
        {
            return await _repository.Users.Find(_ => true).ToListAsync();
        }

        public async Task<User> GetUser(long id)
        {
            FilterDefinition<User> filter = Builders<User>.Filter.Eq(m => m.UserId, id);

            return await _repository.Users.Find(filter).FirstOrDefaultAsync();
        }

        public async Task<User> GetUser(string email)
        {
            FilterDefinition<User> filter = Builders<User>.Filter.Eq(m => m.Email, email);

            return await _repository.Users.Find(filter).FirstOrDefaultAsync();
        }

        public async Task CreateUser(User user)
        {
            await _repository.Users.InsertOneAsync(user);
        }

        public async Task<bool> IsEmailFree(string email)
        {
            var user = await GetUser(email);
            return user == null;
        } 

        public async Task<long> GetNextId()
        {
            return await _repository.Users.CountDocumentsAsync(new BsonDocument()) + 1;
        }

    }
}