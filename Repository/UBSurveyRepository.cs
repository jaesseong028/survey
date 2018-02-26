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
        IEnumerable<UBSurveyInfo> List(int currentPage, int pageSize, DateTime startDate, DateTime endDate, int approveStatus);
        void InsertUBSurvey(UBSurveyInfo contact);
        bool RemoveUBSurvey(string _id);
        UBSurveyInfo GetUBSurvey(string _id);
        bool UpdateUBSurvey(string _id, UBSurveyInfo item);
    }    

    public class UBSurveyRepository : IUBSurveyRepository
    {
        private readonly UBSurveyContext _context = null;

        public UBSurveyRepository(IOptions<DBSettings> settings)
        {
            _context = new UBSurveyContext(settings);
        }

        public void InsertUBSurvey(UBSurveyInfo contact)
        {
             contact.StartDate = DateTime.SpecifyKind(contact.StartDate, DateTimeKind.Utc);
             contact.EndDate = DateTime.SpecifyKind(contact.EndDate, DateTimeKind.Utc);
            _context.UBSurveys.InsertOne(contact);
        }

        public IEnumerable<UBSurveyInfo> List(int currentPage, int pageSize, DateTime startDate, DateTime endDate, int approveStatus)
        {
            //string filter = "StartDate >= DateTime.Parse(\"" + new BsonDateTime(start) + "\") AND EndDate <= DateTime.Parse(\"" + endDate + "\") AND ApproveStatus = " + approveStatus;

            return _context.UBSurveys.AsQueryable()
                .Where(p => p.StartDate >= startDate && p.EndDate <= endDate && p.ApproveStatus == approveStatus)
                .Skip((currentPage - 1) * pageSize)
                .Take(pageSize)
                .Select(s=> s).ToArray();


            //var filterBuilder = Builders<UBSurveyInfo>.Filter;
            //var filter = filterBuilder.Gte(s=> s.StartDate, startDate) & filterBuilder.Lt(s=> s.EndDate, endDate) & filterBuilder.Eq(s=> s.ApproveStatus, approveStatus);
            //return _context.UBSurveys.Find(filter).Skip().Limit(pageSize).ToEnumerable();
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
    }
}