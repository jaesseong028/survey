using MongoDB.Bson;
using MongoDB.Driver;
using System.Collections.Generic;
using MongoDB.Bson.Serialization;
using UBSurvey.Models;
using Microsoft.Extensions.Options;
using UBSurvey.Lib;

namespace UBSurvey.Repository
{
    public class UBSurveyContext : DbContext
    {
        public IMongoCollection<UBSurveyInfo> UBSurveys;
        public IMongoCollection<UBServiceInfo> UBServices;
        
        
        public UBSurveyContext(IOptions<DBSettings> settings) : base(settings)
        {
            UBSurveys = _ubSurveydatabase.GetCollection<UBSurveyInfo>("ubsurveys");
            UBServices = _ubSurveydatabase.GetCollection<UBServiceInfo>("services");
        }
    }
}