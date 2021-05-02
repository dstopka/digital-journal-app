using System.Diagnostics.CodeAnalysis;

namespace JournalApi.Database
{
    [ExcludeFromCodeCoverage]
    public class DbConfig : IDbConfig
    {
        public string? Database { get; set; }
        public string? Host { get; set; }
        public int? Port { get; set; }
        public string? User { get; set; }
        public string? Password { get; set; }          
        public string ConnectionString 
        {
            get {
                if (string.IsNullOrEmpty(User) || string.IsNullOrEmpty(Password))
                    return $@"mongodb://{Host}:{Port}"; 
                
                return $@"mongodb://{User}:{Password}@{Host}:{Port}";
            }
        }
    }
}