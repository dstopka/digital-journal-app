using System.Collections.Generic;
using System.Threading.Tasks;

using JournalApi.Models;
using JournalApi.Responses;

namespace JournalApi.Services.Abstract
{
    public interface IUserService
    {
        Task<IEnumerable<User>> GetAllUsers();
        Task<User> GetById(long id);
        Task<User> GetByEmail(string email);
        Task CreateUser(User user);
        Task<bool> IsEmailFree(string email);
        Task<AuthResponseDto> Authenticate(UserForAuthenticationDto model);
        Task<long> GetNextId();
    }
}