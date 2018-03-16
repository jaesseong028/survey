using MongoDB.Bson;
using MongoDB.Driver;
using System.Collections.Generic;
using MongoDB.Bson.Serialization;
using UBSurvey.Models;
using Microsoft.Extensions.Options;
using System;
using System.Threading.Tasks;
using UBSurvey.Lib;
using System.Linq.Dynamic.Core;
using System.Linq;
using UBSurvey.Common;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using AutoMapper;

namespace UBSurvey.Repository
{
    public interface ISurveyRepository
    {
        bool UpsertSurvey(SurveyInfoDTO contact);
        SurveyInfo GetSurvey(string channelID, string surveyID);
        IEnumerable<SurveyResultCountInfo> GetSurveyResultsCounts(string channelID, IEnumerable<string> surveyIDs);
        bool RemoveSurvey(string channelID, string surveyID);
        bool InsertSurveyResult (string channelID, string surveyID, SurveyResult result);
        int GetSurveyResultCount (string channelID, string surveyID);
        bool ExistsUserToken (string channelID, string surveyID, string userToken);
    } 
    

    public class SurveyRepository : ISurveyRepository
    {
        private readonly SurveyContext _context = null;

        public SurveyRepository(IOptions<DBSettings> settings)
        {
            _context = new SurveyContext(settings);
        }

        public bool UpsertSurvey(SurveyInfoDTO contact)
        {
            if(string.IsNullOrEmpty(contact._channelID))
                throw new Exception("_channelID 가 존재 하지 않습니다.");

            if (!string.IsNullOrEmpty(contact._id))
            {
                var surveyString = contact.Survey.ToString();
                var filter = Builders<BsonDocument>.Filter.Eq("_id", new ObjectId(contact._id));
                string param = string.Format("{{$set: {{ Survey: {0} }}}}", BsonDocument.Parse(surveyString));
                BsonDocument document = BsonDocument.Parse(param);
                UpdateResult actionResult = _context.Surveys.UpdateOne(filter, document);
                return actionResult.IsAcknowledged;
            }
            contact._id = null;
            var setting = new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore };
            BsonDocument doc = BsonDocument.Parse(JsonConvert.SerializeObject(contact, Formatting.None, setting));
            _context.Surveys.InsertOne(doc);

            SurveyInfo d = BsonSerializer.Deserialize<SurveyInfo>(doc);
            var update =  Mapper.Map<SurveyInfo, SurveyInfoDTO>(d);
            contact._id = update._id;
            return true;
        }

        public SurveyInfo GetSurvey(string channelID, string surveyID)
        {
            ObjectId o;
            if (!ObjectId.TryParse(surveyID, out o))
                return null;


            var filter = Builders<BsonDocument>.Filter.Eq("_id", o);
            filter &= Builders<BsonDocument>.Filter.Eq("_channelID", channelID);
            var data = _context.Surveys
                            .Find(filter)
                            .FirstOrDefault();
            
            if (data == null)
                return null;
                
            return BsonSerializer.Deserialize<SurveyInfo>(data);
        }

        public IEnumerable<SurveyResultCountInfo> GetSurveyResultsCounts(string channelID, IEnumerable<string> surveyIDs)
        {
            List<ObjectId> objectIds = new List<ObjectId>();
            foreach(var surveyID in surveyIDs)
            {
                ObjectId o;
                if (!ObjectId.TryParse(surveyID, out o))
                {
                    return new List<SurveyResultCountInfo>();
                }
                objectIds.Add(o);
            }


            var filter = Builders<BsonDocument>.Filter.In("_id", objectIds);
            filter &= Builders<BsonDocument>.Filter.Eq("_channelID", channelID);


            var ddd =filter.ToString();

            string where = filter.RenderToBsonDocument();
            BsonDocument query = MongoDB.Bson.Serialization.BsonSerializer.Deserialize<BsonDocument>(where);
            var data = _context.Surveys.Find(query).Project("{_surveyResult:1}").ToEnumerable();

            var surveyData = from d in data
                          select BsonSerializer.Deserialize<SurveyInfo>(d);

            return surveyData.Select(q=> new SurveyResultCountInfo{ _id = q._id, Counts = q._surveyResult.Count() });
        }

       

        public bool RemoveSurvey(string channelID, string surveyID)
        {
            ObjectId o;
            if (!ObjectId.TryParse(surveyID, out o))
                return false;

            var filter = Builders<BsonDocument>.Filter.Eq("_id", o);
            filter &= Builders<BsonDocument>.Filter.Eq("_channelID", channelID);

            DeleteResult actionResult = _context.Surveys.DeleteOne(filter);
            return actionResult.IsAcknowledged 
                && actionResult.DeletedCount > 0;
        }   
        /// API 로 연결 하지 말것
        public bool InsertSurveyResult (string channelID, string surveyID, SurveyResult result)
        {
            ObjectId o;
            if (!ObjectId.TryParse(surveyID, out o))
                return false;
            var filter = Builders<BsonDocument>.Filter.Eq("_id", o);
            filter &= Builders<BsonDocument>.Filter.Eq("_channelID", channelID);


            var data = _context.Surveys.Find(filter).FirstOrDefault();

            if (result == null || data == null)
                return false;

            
            SurveyInfo sur =  BsonSerializer.Deserialize<SurveyInfo>(data);
            sur._surveyResult = sur._surveyResult.Append(result);

            string param = string.Format("{{$set: {{ _surveyResult: {0} }}}}", JsonConvert.SerializeObject(sur._surveyResult));
            BsonDocument document = BsonDocument.Parse(param);
            UpdateResult actionResult = _context.Surveys.UpdateOne(filter, document);

            return actionResult.IsAcknowledged
                && actionResult.ModifiedCount > 0;
        }

        public int GetSurveyResultCount (string channelID, string surveyID)
        {
            ObjectId o;
            if (!ObjectId.TryParse(surveyID, out o))
                return 0;

            var filter = Builders<BsonDocument>.Filter.Eq("_id", o);
            filter &= Builders<BsonDocument>.Filter.Eq("_channelID", channelID);

            var data = _context.Surveys.Find(filter).FirstOrDefault();

            if (data == null)
                return 0;

            SurveyInfo sur = BsonSerializer.Deserialize<SurveyInfo>(data);

            return sur._surveyResult.Count();
        }

        public bool ExistsUserToken (string channelID, string surveyID, string userToken)
        {
            ObjectId o;
            if (!ObjectId.TryParse(surveyID, out o))
                return false;

            var filter = Builders<BsonDocument>.Filter.Eq("_id", o);
            filter &= Builders<BsonDocument>.Filter.Eq("_channelID", channelID);

                
            var data = _context.Surveys.Find(filter).FirstOrDefault();

            if (data == null)
                return false;

            SurveyInfo sur = BsonSerializer.Deserialize<SurveyInfo>(data);

            return sur._surveyResult.Any(q=> q.UserToken == userToken);
        }
    }
}
