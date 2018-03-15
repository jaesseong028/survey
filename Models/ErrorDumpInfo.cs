using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

public class ErrorDumpInfo
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    [BsonIgnoreIfDefault]
    [JsonIgnore]
    public virtual string _id { get; set; }
    public virtual string Message { get; set; }
    public virtual string StackTrace { get; set; }
    public virtual string URL { get; set; }
    [JsonIgnore]
    public virtual DateTime CreateDate { get; set; }
    public virtual string CreateDateStr { get { return CreateDate.ToString("yyyy-MM-dd HH:ss"); } }
}