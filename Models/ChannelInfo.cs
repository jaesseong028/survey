using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace UBSurvey.Models
{
    public class ChannelInfo
    {
        public ObjectId _id { get; set; }
        public string ServiceName { get; set;}
    }
}