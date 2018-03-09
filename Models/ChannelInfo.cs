using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace UBSurvey.Models
{
    public class ChannelInfo
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }

        public string ServiceName { get; set;}
    }
}