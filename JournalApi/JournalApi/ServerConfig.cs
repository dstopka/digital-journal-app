using System.Diagnostics.CodeAnalysis;

namespace JournalApi
{
    [ExcludeFromCodeCoverage]
    public class ServerConfig
    {
        public DbContext MongoDb { get; set; } = new DbContext();
    }
}