using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace UBSurvey.Models
{
    public class SurveyInfo
    {
        public ObjectId _id { get; set; }
        public string _chanelID { get; set;}
        public dynamic Survey { get; set;}
        public dynamic _surveyResult { get; set;}
    }
}