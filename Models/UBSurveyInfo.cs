
using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson.Serialization.IdGenerators;

namespace UBSurvey.Models
{

    [BsonIgnoreExtraElements]
    public class UBSurveyInfo
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }
        public string SurveyID { get; set; }
        public short ApproveStatus { get; set;}
        public string Title { get; set;}
        public int LimitPersons { get; set;}
        public DateTime StartDate { get; set;}
        public DateTime EndDate { get; set;}
    }
}