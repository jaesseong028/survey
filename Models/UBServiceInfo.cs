
using System;
using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson.Serialization.IdGenerators;
using Newtonsoft.Json;
using UBSurvey.Common;

namespace UBSurvey.Models
{

    [BsonIgnoreExtraElements]
    public class UBServiceInfo
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public virtual string _id { get; set; }
        public virtual string ChannelID { get; set; }
        public virtual string Desript { get; set;}
        public virtual bool Visible { get; set;}
        public virtual IEnumerable<string> Users { get; set;}
        
    }
}