using System.Diagnostics.CodeAnalysis;

namespace JournalApi
{
    [ExcludeFromCodeCoverage]
    public class DbContext
    {
        public string Database { get; set; } = null!;
        public string Host { get; set; } = null!;
        public int? Port { get; set; } = 0;
        public string User { get; set; } = null!;
        public string Password { get; set; } = null!;         
        
        public string ConnectionString 
        {
            get {
                if (string.IsNullOrEmpty(User) || string.IsNullOrEmpty(Password))
                    return $@"journal-mongo://{Host}:{Port}"; 
                
                return $@"journal-mongo://{User}:{Password}@{Host}:{Port}";
            }
        }
    }
}