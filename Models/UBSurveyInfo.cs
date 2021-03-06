
using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson.Serialization.IdGenerators;
using Newtonsoft.Json;
using UBSurvey.Common;

namespace UBSurvey.Models
{

    [BsonIgnoreExtraElements]
    public class UBSurveyInfo
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public virtual string _id { get; set; }
        public virtual string SurveyID { get; set; }
        public virtual string ChannelID { get; set; }
        public virtual short ApproveStatus { get; set;}
        public virtual string Title { get; set;}
        public virtual int LimitPersons { get; set;}
        public virtual DateTime StartDate { get; set;}
        public virtual DateTime EndDate { get; set;}
        
    }

    public class UBSurveyListInfo : UBSurveyInfo
    {
        [JsonIgnore]
        public override short ApproveStatus { get; set;}
        [JsonIgnore]
        public override int LimitPersons { get; set;}
        [JsonIgnore]
        public override DateTime StartDate { get; set;}
        [JsonIgnore]
        public override DateTime EndDate { get; set;}
        public int ResultCount { get; set;}
        public string ApproveStatusStr { get { return ((UbSurveyApprove)((int)ApproveStatus)).getEnumDescription(); }}
        public string StartDateAndEndDate { get { return $"{StartDate.ToString("yyyy-MM-dd")}~{EndDate.ToString("yyyy-MM-dd")}"; }}
        public string LimitPersonsStr { get { return $"{ResultCount}/{LimitPersons}"; }}
        public string CurrentStatusStr 
        {  
            get     
            { 
                return (LimitPersons > ResultCount && DateTime.Now > StartDate && DateTime.Now < EndDate.AddDays(1)) ? "진행중" :  "마감";
            } 
        }
    }

    public class UBSurveyEditInfo 
    {
        public UBSurveyEditInfo ()
        {
            SurveyInfo = new SurveyInfo();
        }
        public string UrlParameter { get; set; }
        public UBSurveyInfo Survey { get; set; } 

        public SurveyInfo SurveyInfo { get; set; } 
        public string ChannelName { get; set;}

    }


} 