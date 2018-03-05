using System;
using System.Collections.Generic;
using System.Linq;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace UBSurvey.Models
{
    public class SurveyInfo
    {
        public SurveyInfo()
        {
            _surveyResult = Enumerable.Empty<SurveyResult>();
        }
        public ObjectId _id { get; set; }
        public string _channelID { get; set;}
        public dynamic Survey { get; set;}
        public IEnumerable<dynamic> _surveyResult { get; set;}
    }

    public class SurveyResult 
    {
        public string UserToken { get; set; }
        public dynamic Values { get; set;}
    }

    public class V_ProgressInfo
    {
        public string _info { get; set; }   // SurveyID + channelID : Encrypt

        public dynamic Survey{ get; set; }

        public dynamic _surveyResult { get; set; }
    }
}