using MongoDB.Bson;
using MongoDB.Driver;
using System.Collections.Generic;
using MongoDB.Bson.Serialization;
using UBSurvey.Models;
using Microsoft.Extensions.Options;
using UBSurvey.Lib;

namespace UBSurvey.Repository
{
    public class DbContext
    {
        protected readonly IMongoClient _client;
        protected readonly IMongoDatabase _database;
        
        public DbContext(IOptions<Settings> settings) 
        {
            var _client = new MongoClient(settings.Value.ConnectionString);
            if (_client != null)
                _database = _client.GetDatabase(settings.Value.Database);
        }
    }
}