using System.Collections.Generic;
using System.Threading.Tasks;
using System.Text;
using System;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Bson;
using MongoDB.Driver;
using BC = BCrypt.Net.BCrypt;

using JournalApi.Database;
using JournalApi.Models;
using JournalApi.Services.Abstract;
using JournalApi.Responses;
using JournalApi.Helpers;

namespace JournalApi.Services 
{
    public class UserService : IUserService
    {
        private readonly MongoRepository _repository;
        private readonly AppSettings _appSettings;

        public UserService(IDbConfig config, IOptions<AppSettings> appSettings) 
        {
            _repository = new MongoRepository(config);
            _appSettings = appSettings.Value;
        } 

        public async Task<IEnumerable<User>> GetAllUsers() 
        {
            return await _repository.Users.Find(_ => true).ToListAsync();
        }

        public async Task<User> GetById(long id)
        {
            FilterDefinition<User> filter = Builders<User>.Filter.Eq(m => m.UserId, id);

            return await _repository.Users.Find(filter).FirstOrDefaultAsync();
        }

        public async Task<User> GetByEmail(string email)
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
            var user = await GetByEmail(email);
            return user == null;
        } 

        public async Task<AuthResponseDto> Authenticate(UserForAuthenticationDto model)
        {
            var user = await GetByEmail(model?.Email!);

            if (user == null || !BC.Verify(model?.Password!, user.Password))
            {
                return new AuthResponseDto{Errors = new string[] { "Invalid email or password" }};
            }

            var token = generateJwtToken(user);

            return new AuthResponseDto{IsSuccessful = true, Token = token};
        }

        private string generateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings?.Secret!);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] { new Claim("id", user.UserId.ToString()) }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public async Task<long> GetNextId()
        {
            return await _repository.Users.CountDocumentsAsync(new BsonDocument()) + 1;
        }

    }
}