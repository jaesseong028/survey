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
        
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        [BsonIgnoreIfDefault]
        public virtual string _id { get; set; }
        public virtual string _channelID { get; set;}
        public virtual dynamic Survey { get; set;}
        [JsonIgnore]
        public virtual IEnumerable<SurveyResult> _surveyResult { get; set;}
    }

    public class SurveyInfoDTO : SurveyInfo
    {
        
        public override string _id { get; set; }
        public override string _channelID { get; set;}
        public override dynamic Survey { get; set;}
        public override IEnumerable<SurveyResult> _surveyResult { get; set;}

    }

    public class SurveyResult 
    {
        public string UserToken { get; set; }
        public dynamic Values { get; set;}
    }


    
    public class SurveyResultCountInfo
    {
        public string _id { get; set; }
        public int Counts { get; set;}
    }

    public class V_ProgressInfo
    {
        public string _info { get; set; }   // SurveyID + channelID : Encrypt

        public dynamic Survey{ get; set; }
        public dynamic _surveyResult { get; set; }
    }
}