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

namespace UBSurvey.Repository
{
    public interface ISurveyRepository
    {
        bool UpsertSurvey(SurveyInfo contact);
        SurveyInfo GetSurvey(string channelID, string surveyID);
        bool RemoveSurvey(string channelID, string surveyID);
        bool InsertSurveyResult (string channelID, string surveyID, SurveyResult result);
        string GetChannelEncryptKey (string channelID);
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

        public bool UpsertSurvey(SurveyInfo contact)
        {
            if(string.IsNullOrEmpty(contact._channelID))
                throw new Exception("_channelID 가 존재 하지 않습니다.");

                
            if (!string.IsNullOrEmpty(contact._id))
            {
                ReplaceOneResult actionResult = _context.Surveys.ReplaceOne(n => n._id.Equals(new ObjectId(contact._id)), contact, new UpdateOptions { IsUpsert = true });
                return actionResult.IsAcknowledged;
                // && actionResult.ModifiedCount > 0;
            }
            _context.Surveys.InsertOne(contact);

            return true;
        }

        public SurveyInfo GetSurvey(string channelID, string surveyID)
        {
            ObjectId o;
            if (!ObjectId.TryParse(surveyID, out o))
                return null;


            var filter = Builders<SurveyInfo>.Filter.Eq("_id", o);
            filter &= Builders<SurveyInfo>.Filter.Eq(q=> q._channelID, channelID);
            var data = _context.Surveys
                            .Find(filter)
                            .FirstOrDefault();
            
            if (data == null)
                return null;
                
            data.Survey = Helpers.ToDynamic(data.Survey);
            
            return data;
        }

        public bool RemoveSurvey(string channelID, string surveyID)
        {
            ObjectId o;
            if (!ObjectId.TryParse(surveyID, out o))
                return false;

            DeleteResult actionResult = _context.Surveys.DeleteOne(p=> p._channelID == channelID && p._id.Equals(o));
            return actionResult.IsAcknowledged 
                && actionResult.DeletedCount > 0;
        }   
        /// API 로 연결 하지 말것
        public bool InsertSurveyResult (string channelID, string surveyID, SurveyResult result)
        {
            ObjectId o;
            if (!ObjectId.TryParse(surveyID, out o))
                return false;

            var data = _context.Surveys.AsQueryable().Where(p => p._channelID == channelID && p._id.Equals(o)).FirstOrDefault();

            if (result == null || data == null)
                return false;

            var bsonDoc = result.ToBsonDocument();
            data._surveyResult = data._surveyResult.Append(bsonDoc);


            ReplaceOneResult actionResult 
                = _context.Surveys.ReplaceOne(p => p._channelID == channelID && p._id.Equals(o), data, new UpdateOptions { IsUpsert = true });

            return actionResult.IsAcknowledged
                && actionResult.ModifiedCount > 0;
        }

        /// API 로 연결 하지 말것
        public string GetChannelEncryptKey(string channelID)
        {
            ObjectId o;
            if (!ObjectId.TryParse(channelID, out o))
                return null;

            var data = _context.Channels.AsQueryable().Where(p => p._id.Equals(o)).FirstOrDefault();
            if(data == null)
                return null;

            return data.EncryptKey;
        }
        public int GetSurveyResultCount (string channelID, string surveyID)
        {
            ObjectId o;
            if (!ObjectId.TryParse(surveyID, out o))
                return 0;

            var data = _context.Surveys.AsQueryable().Where(p => p._channelID == channelID && p._id.Equals(o)).FirstOrDefault();

            if (data == null)
                return 0;

            return data._surveyResult.Count();
        }

        public bool ExistsUserToken (string channelID, string surveyID, string userToken)
        {
            ObjectId o;
            if (!ObjectId.TryParse(surveyID, out o))
                return false;
                
            var data = _context.Surveys.AsQueryable().Where(p => p._channelID == channelID && p._id.Equals(o)).FirstOrDefault();

            if (data == null)
                return false;

            return data._surveyResult.Any(q=> q.UserToken == userToken);
        }
    }
}