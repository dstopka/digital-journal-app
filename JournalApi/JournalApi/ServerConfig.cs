namespace JournalApi
{
    public class ServerConfig
    {
        public DbContext MongoDb { get; set; } = new DbContext();
    }
}