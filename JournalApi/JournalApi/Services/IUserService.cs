using System.Collections.Generic;
using System.Threading.Tasks;

using JournalApi.Models;

namespace JournalApi.Services.Abstract
{
    public interface IUserService
    {
        Task<IEnumerable<User>> GetAllUsers();
        Task<User> GetUser(long id);
        Task<User> GetUser(string email);
        Task CreateUser(User user);
        Task<bool> IsEmailFree(string email);
        Task<long> GetNextId();
    }
}