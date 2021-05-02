using System.Collections.Generic;

namespace JournalApi.Responses
{
    public class AuthResponseDto
    {
        public bool IsSuccessful { get; set; }
        public IEnumerable<string>? Errors { get; set; }
        public long Id { get; set; }
        public string? Token { get; set; }
    }
}