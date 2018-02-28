using System;
using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace UBSurvey.Models
{
    public class SurveyInfo
    {
        public ObjectId _id { get; set; }
        public string _channelID { get; set;}
        public dynamic Survey { get; set;}
        public IEnumerable<SurveyResult> _surveyResult { get; set;}
    }

    public class SurveyResult 
    {
        public string UserToken { get; set; }
        
        public dynamic resultList { get; set;}
    }
}