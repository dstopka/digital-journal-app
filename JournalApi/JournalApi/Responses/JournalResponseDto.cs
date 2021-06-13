using System.Collections.Generic;

namespace JournalApi.Responses
{
    public class JournalResponseDto
    {
        public bool IsSuccessful { get; set; }
        public IEnumerable<string>? Errors { get; set; }
    }
}