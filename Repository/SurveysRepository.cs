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
        bool UpdateSurvey(ObjectId Id, SurveyInfo item);
        bool RemoveSurvey(ObjectId Id);
        bool UpdateSurveyResult (string suerveyID, SurveyResult result);
        string GetChannelEncryptKey (string channelId);
        int GetSurveyResultCount (string suerveyID);
        bool ExistsUserToken (string suerveyID, string userToken);
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
            _context.Surveys.InsertOne(contact);
        }

        public SurveyInfo GetSurvey(string channelID, string surveyID)
        {
            return _context.Surveys.AsQueryable()
                .Where(p => p._id == new ObjectId(surveyID) && p._channelID == channelID).FirstOrDefault();
        }

        public bool RemoveSurvey(ObjectId Id)
        {
            DeleteResult actionResult = _context.Surveys.DeleteOne(Builders<SurveyInfo>.Filter.Eq("Id", Id));
            return actionResult.IsAcknowledged 
                && actionResult.DeletedCount > 0;
         }   

        public bool UpdateSurvey(ObjectId Id, SurveyInfo item)
        {
            ReplaceOneResult actionResult 
                = _context.Surveys.ReplaceOne(n => n._id.Equals(Id), item, new UpdateOptions { IsUpsert = true });
            return actionResult.IsAcknowledged
                && actionResult.ModifiedCount > 0;
        }

        public bool UpdateSurveyResult (string suerveyID, SurveyResult result)
        {
            var data = _context.Surveys.AsQueryable().Where(p => p._id.Equals(new ObjectId(suerveyID))).FirstOrDefault();

            if (result == null || data == null)
                return false;

            data._surveyResult.Append(result);

            ReplaceOneResult actionResult 
                = _context.Surveys.ReplaceOne(p => p._id.Equals(new ObjectId(suerveyID)), data, new UpdateOptions { IsUpsert = true });

            return actionResult.IsAcknowledged
                && actionResult.ModifiedCount > 0;
        }

        public string GetChannelEncryptKey (string channelId)
        {
            var data = _context.Channels.AsQueryable().Where(p => p._id.Equals(new ObjectId(channelId))).FirstOrDefault();
            if(data == null)
                return null;

            return data.EncryptKey;
        }
        public int GetSurveyResultCount (string suerveyID)
        {
            var data = _context.Surveys.AsQueryable().Where(p => p._id.Equals(new ObjectId(suerveyID))).FirstOrDefault();

            if (data == null)
                return 0;

            return data._surveyResult.Count();
        }

        public bool ExistsUserToken (string suerveyID, string userToken)
        {
            var data = _context.Surveys.AsQueryable().Where(p => p._id.Equals(new ObjectId(suerveyID))).FirstOrDefault();

            if (data == null)
                return false;

            return data._surveyResult.Any(q=> q.UserToken == userToken);
        }
    }
}