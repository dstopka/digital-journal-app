using System;

namespace JournalApi.Models
{
    public class Journal
    {
        public string? JournalText {get; set;}
        public long? UserId {get; set;}
        public string? Date {get; set;}
        public bool? IsImportant {get; set;}
    }
}