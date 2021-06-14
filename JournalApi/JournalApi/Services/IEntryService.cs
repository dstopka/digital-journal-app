using System.Collections.Generic;
using System.Threading.Tasks;

using JournalApi.Models;
using JournalApi.Responses;

namespace JournalApi.Services.Abstract
{
    public interface IEntryService
    {
        Task<IEnumerable<EntryInfoDto>> GetEntryInfos(long userId);
        Task<long> GetNextId();
        Task CreateEntry(JournalEntry journal);
        Task<JournalEntry> GetEntryByDateAndId(string date, long userId);
    }
}