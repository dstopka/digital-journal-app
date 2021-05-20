using System;

namespace JournalApi.Models
{
    public class EntryInfoDto
    {
        public DateTime? Date { get; set; }
        public bool? IsImportant {get; set;}
    }
}