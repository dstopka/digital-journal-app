using System.ComponentModel.DataAnnotations;

namespace JournalApi.Models
{
    public class JournalEntryDto
    {
        public string? EntryText {get; set;}

        [Required(ErrorMessage = "UserId is required")]
        public long? UserId {get; set;}

        [Required(ErrorMessage = "Date is required")]
        public string? Date {get; set;}
        public bool? IsImportant {get; set;}
    }
}