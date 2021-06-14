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
    public class EntryService : IEntryService
    {
        private readonly MongoRepository _repository;
        private EntryInfoDto[] entryInfos;

        public EntryService(MongoRepository mongoRepository)
        {
            _repository = mongoRepository;
            entryInfos = new EntryInfoDto[] {
                    new EntryInfoDto{Date = DateTime.Today, IsImportant = true},
                    new EntryInfoDto{Date = DateTime.Today.AddDays(1), IsImportant = false},
                    new EntryInfoDto{Date = DateTime.Today.AddDays(-5), IsImportant = true}
                };
        }

        public async Task<IEnumerable<EntryInfoDto>> GetEntryInfos(long userId)
        {
            return await Task.Run(() => {return entryInfos; });
        }

        public async Task<long> GetNextId()
        {
            return await _repository.Users.CountDocumentsAsync(new BsonDocument()) + 1;
        }

        public async Task CreateEntry(JournalEntry entry)
        {
            await _repository.JournalEntries.InsertOneAsync(entry);
        }

        public async Task<JournalEntry> GetEntryByDateAndId(string date, long userId)
        {
            var builder = Builders<JournalEntry>.Filter;
            FilterDefinition<JournalEntry> filterByUserId = builder.Eq(m => m.UserId, userId);
            FilterDefinition<JournalEntry> filterByDate = builder.Eq(m => m.Date, date);

            var userIdAndDateFilter = builder.And(new [] {filterByUserId, filterByDate});

            return await _repository.JournalEntries.Find(userIdAndDateFilter).FirstOrDefaultAsync();
        }
    }
}