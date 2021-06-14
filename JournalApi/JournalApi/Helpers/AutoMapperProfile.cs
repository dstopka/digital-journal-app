using AutoMapper;
using JournalApi.Models;
using System.Collections.Generic;

namespace JournalApi.Helpers
{    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<UserForRegistrationDto, User>();
            CreateMap<JournalEntryDto, JournalEntry>();
            CreateMap<JournalEntry, EntryInfoDto>();
        }
    }
}