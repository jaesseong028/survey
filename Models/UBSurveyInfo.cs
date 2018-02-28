
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
        public string _id { get; set; }
        public string SurveyID { get; set; }
        [JsonIgnore]
        public short ApproveStatus { get; set;}
        public string Title { get; set;}
        [JsonIgnore]
        public int LimitPersons { get; set;}
        [JsonIgnore]
        public DateTime StartDate { get; set;}
        [JsonIgnore]
        public DateTime EndDate { get; set;}
        public string ApproveStatusStr { get { return ((UbSurveyApprove)((int)ApproveStatus)).getEnumDescription(); }}
        public string StartDateAndEndDate { get { return $"{StartDate.ToString("yyyy-MM-dd")}~{EndDate.ToString("yyyy-MM-dd")}"; }}
        public string LimitPersonsStr { get { return $"{LimitPersons} 명"; }}
    }
} 