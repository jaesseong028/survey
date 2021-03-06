using MongoDB.Bson;
using MongoDB.Driver;
using System.Collections.Generic;
using MongoDB.Bson.Serialization;
using UBSurvey.Models;
using Microsoft.Extensions.Options;
using UBSurvey.Lib;

namespace UBSurvey.Repository
{
    public class SurveyContext : DbContext
    {
        public IMongoCollection<BsonDocument> Surveys;
        public IMongoCollection<BsonDocument> Channels;
        
        public SurveyContext(IOptions<DBSettings> settings) : base(settings)
        {
            Surveys = _surveyDatabase.GetCollection<BsonDocument>("surveys");
            Channels = _surveyDatabase.GetCollection<BsonDocument>("channels");
        }
    }
}