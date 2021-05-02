using System.Collections.Generic;

namespace JournalApi.Responses
{
    public class RegistrationResponseDto
    {
        public bool IsSuccessful { get; set; }
        public IEnumerable<string>? Errors { get; set; }
    }
}