using AutoMapper;
using JournalApi.Models;

namespace JournalApi.Helpers
{    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<UserForRegistrationDto, User>();
        }
    }
}