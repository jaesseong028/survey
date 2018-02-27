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
    }
}