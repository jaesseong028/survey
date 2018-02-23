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
    public interface ISurveysRepository
    {
        Task InsertSurvey(SurveyInfo contact);
        Task<SurveyInfo> GetSurvey(ObjectId Id);
        Task<bool> UpdateSurvey(ObjectId Id, SurveyInfo item);
        Task<bool> RemoveSurvey(ObjectId Id);
        IEnumerable<SurveyInfo> List(string jsonFilter, string chanelID, int currentPage, int pageSize);
    } 
    

    public class SurveysRepository : ISurveysRepository
    {
        private readonly SurveyContext _context = null;

        public SurveysRepository(IOptions<Settings> settings)
        {
            _context = new SurveyContext(settings);
        }
        
        public IEnumerable<SurveyInfo> List(string jsonFilter, string chanelID, int currentPage, int pageSize)
        {
            return  _context.Surveys.AsQueryable().Where("_bizData != null AND _limit = 0").Skip((currentPage - 1) * pageSize).Take(pageSize).ToArray();
        }

        public async Task InsertSurvey(SurveyInfo contact)
        {
            try
            {
                await _context.Surveys.InsertOneAsync(contact);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<SurveyInfo> GetSurvey(ObjectId Id)
        {
            var filter = Builders<SurveyInfo>.Filter.Eq("Id", Id);

            try
            {
                return await _context.Surveys
                                .Find(filter)
                                .FirstOrDefaultAsync();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<bool> RemoveSurvey(ObjectId Id)
        {
            try
            {
                DeleteResult actionResult = await _context.Surveys.DeleteOneAsync(Builders<SurveyInfo>.Filter.Eq("Id", Id));

                return actionResult.IsAcknowledged 
                    && actionResult.DeletedCount > 0;
            }
            catch (Exception ex)
            {
                throw ex;
            }
         }   

        public async Task<bool> UpdateSurvey(ObjectId Id, SurveyInfo item)
        {
            try
            {
                ReplaceOneResult actionResult 
                    = await _context.Surveys.ReplaceOneAsync(n => n._id.Equals(Id), item, new UpdateOptions { IsUpsert = true });
                return actionResult.IsAcknowledged
                    && actionResult.ModifiedCount > 0;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}