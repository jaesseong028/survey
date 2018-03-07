using MongoDB.Driver;
using System.Collections.Generic;
using Microsoft.Extensions.Options;
using UBSurvey.Lib;
using System.Linq.Dynamic.Core;
using UBSurvey.Models;
using System.Linq;
using System;
using System.Threading.Tasks;
using MongoDB.Bson;

namespace UBSurvey.Repository
{
    public interface IUBSurveyRepository
    {
        IEnumerable<UBSurveyInfo> List(string channelID, int currentPage, int pageSize, string title, DateTime? startDate, DateTime? endDate, int? approveStatus, out long totalCount);
        bool UpSertUBSurvey(UBSurveyInfo contact);
        bool RemoveUBSurvey(string _id);
        UBSurveyInfo GetUBSurvey(string _id);
        //bool UpdateUBSurvey(UBSurveyInfo item);
        IEnumerable<UBServiceInfo> GetServices();
    }    

    public class UBSurveyRepository : IUBSurveyRepository
    {
        private readonly UBSurveyContext _context = null;

        public UBSurveyRepository(IOptions<DBSettings> settings)
        {
            _context = new UBSurveyContext(settings);
        }

        public bool UpSertUBSurvey(UBSurveyInfo contact)
        {
            contact.StartDate = DateTime.SpecifyKind(contact.StartDate, DateTimeKind.Utc);
            contact.EndDate = DateTime.SpecifyKind(contact.EndDate, DateTimeKind.Utc);

            ReplaceOneResult actionResult = _context.UBSurveys.ReplaceOne(n => n._id.Equals(new ObjectId(contact._id)), contact, new UpdateOptions { IsUpsert = true });
            return actionResult.IsAcknowledged
                && actionResult.ModifiedCount > 0;
        }

        public IEnumerable<UBSurveyInfo> List(string channelID, int currentPage, int pageSize, string title, DateTime? startDate, DateTime? endDate, int? approveStatus, out long totalCount)
        {
            if(currentPage < 1)
            {
               totalCount = 0;
               return Enumerable.Empty<UBSurveyInfo>();
            }
            var _filterDef = Builders<UBSurveyInfo>.Filter.Empty;

            if (startDate.HasValue)
                _filterDef &= Builders<UBSurveyInfo>.Filter.Gte(t => t.StartDate, startDate.Value);
                
            if (endDate.HasValue)
                _filterDef &= Builders<UBSurveyInfo>.Filter.Lte(t => t.EndDate, endDate.Value);

            if(approveStatus.HasValue)
                _filterDef &= Builders<UBSurveyInfo>.Filter.Eq(t => t.ApproveStatus, approveStatus.Value);

            if(!string.IsNullOrEmpty(title))
                _filterDef &= Builders<UBSurveyInfo>.Filter.Regex(t => t.Title, title);

            totalCount = _context.UBSurveys.Find(_filterDef).Count();
            return _context.UBSurveys.Find(_filterDef).Skip((currentPage - 1) * pageSize).Limit(pageSize).ToEnumerable();
        }

        public bool RemoveUBSurvey(string _id)
        {
            DeleteResult actionResult = _context.UBSurveys.DeleteOne(Builders<UBSurveyInfo>.Filter.Eq("_id", new ObjectId(_id)));

            return actionResult.IsAcknowledged 
                && actionResult.DeletedCount > 0;
        }

        public UBSurveyInfo GetUBSurvey(string _id)
        {
            var filter = Builders<UBSurveyInfo>.Filter.Eq("_id", new ObjectId(_id));
            return _context.UBSurveys
                            .Find(filter)
                            .FirstOrDefault();
        }
        
        public bool UpdateUBSurvey(string _id, UBSurveyInfo item)
        {
            ReplaceOneResult actionResult 
                = _context.UBSurveys.ReplaceOne(n => n._id.Equals(new ObjectId(_id)), item, new UpdateOptions { IsUpsert = true });
            return actionResult.IsAcknowledged
                && actionResult.ModifiedCount > 0;
        }   


        public IEnumerable<UBServiceInfo> GetServices()
        {
            var filter = Builders<UBServiceInfo>.Filter.Empty;
            return _context.UBServices.Find(filter).ToEnumerable();
        }   
    }
}