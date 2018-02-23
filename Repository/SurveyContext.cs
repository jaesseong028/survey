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
        public IMongoCollection<SurveyInfo> Surveys;
        
        public SurveyContext(IOptions<Settings> settings) : base(settings)
        {
            Surveys = _database.GetCollection<SurveyInfo>("surveys");
        }
    }
}