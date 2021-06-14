using System.Collections.Generic;

namespace JournalApi.Responses
{
    public class CreateEntryResponseDto
    {
        public bool IsSuccessful { get; set; }
        public IEnumerable<string>? Errors { get; set; }
    }
}