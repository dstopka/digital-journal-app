using System;

namespace JournalApi.Models
{
    public class EntryInfoDto
    {
        public string? Date { get; set; }
        public bool? IsImportant {get; set;}
    }
}