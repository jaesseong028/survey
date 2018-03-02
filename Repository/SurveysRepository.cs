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


namespace UBSurvey.Repository
{
    public interface ISurveyRepository
    {
        void InsertSurvey(SurveyInfo contact);
        SurveyInfo GetSurvey(string channelID, string surveyID);
        bool UpdateSurvey(string channelID, string surveyID, SurveyInfo item);
        bool RemoveSurvey(string channelID, string surveyID);
        bool InsertSurveyResult (string channelID, string suerveyID, SurveyResult result);
        string GetChannelEncryptKey (string channelID);
        int GetSurveyResultCount (string channelID, string suerveyID);
        bool ExistsUserToken (string channelID, string suerveyID, string userToken);
    } 
    

    public class SurveyRepository : ISurveyRepository
    {
        private readonly SurveyContext _context = null;

        public SurveyRepository(IOptions<DBSettings> settings)
        {
            _context = new SurveyContext(settings);
        }

        public void InsertSurvey(SurveyInfo contact)
        {
            if(string.IsNullOrEmpty(contact._channelID))
                throw new Exception("_channelID 가 존재 하지 않습니다.");
            _context.Surveys.InsertOne(contact);
        }

        public SurveyInfo GetSurvey(string channelID, string surveyID)
        {
            return _context.Surveys.AsQueryable()
                .Where(p => p._id == new ObjectId(surveyID) && p._channelID == channelID).FirstOrDefault();
        }

        public bool RemoveSurvey(string channelID, string surveyID)
        {
            DeleteResult actionResult = _context.Surveys.DeleteOne(p=> p._channelID == channelID && p._id.Equals(new ObjectId(surveyID)));
            return actionResult.IsAcknowledged 
                && actionResult.DeletedCount > 0;
        }   

        public bool UpdateSurvey(string channelID, string surveyID, SurveyInfo item)
        {
            ReplaceOneResult actionResult 
                = _context.Surveys.ReplaceOne(p => p._channelID == channelID && p._id.Equals(new ObjectId(surveyID)), item, new UpdateOptions { IsUpsert = true });
            return actionResult.IsAcknowledged
                && actionResult.ModifiedCount > 0;
        }

        /// API 로 연결 하지 말것
        public bool InsertSurveyResult (string channelID, string suerveyID, SurveyResult result)
        {
            var data = _context.Surveys.AsQueryable().Where(p => p._channelID == channelID && p._id.Equals(new ObjectId(suerveyID))).FirstOrDefault();

            if (result == null || data == null)
                return false;

            var bsonDoc = result.ToBsonDocument();
            data._surveyResult.Append(bsonDoc);

            ReplaceOneResult actionResult 
                = _context.Surveys.ReplaceOne(p => p._channelID == channelID && p._id.Equals(new ObjectId(suerveyID)), data, new UpdateOptions { IsUpsert = true });

            return actionResult.IsAcknowledged
                && actionResult.ModifiedCount > 0;
        }

        /// API 로 연결 하지 말것
        public string GetChannelEncryptKey(string channelID)
        {
            var data = _context.Channels.AsQueryable().Where(p => p._id.Equals(new ObjectId(channelID))).FirstOrDefault();
            if(data == null)
                return null;

            return data.EncryptKey;
        }
        public int GetSurveyResultCount (string channelID, string suerveyID)
        {
            var data = _context.Surveys.AsQueryable().Where(p => p._channelID == channelID && p._id.Equals(new ObjectId(suerveyID))).FirstOrDefault();

            if (data == null)
                return 0;

            return data._surveyResult.Count();
        }

        public bool ExistsUserToken (string channelID, string suerveyID, string userToken)
        {
            var data = _context.Surveys.AsQueryable().Where(p => p._channelID == channelID && p._id.Equals(new ObjectId(suerveyID))).FirstOrDefault();

            if (data == null)
                return false;

            return data._surveyResult.Any(q=> q.UserToken == userToken);
        }
    }
}