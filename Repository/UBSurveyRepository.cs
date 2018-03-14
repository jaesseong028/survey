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
using Newtonsoft.Json;

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
        void DumpError(object o);
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


            if (!string.IsNullOrEmpty(contact._id))
            {
                ReplaceOneResult actionResult = _context.UBSurveys.ReplaceOne(n => n._id.Equals(new ObjectId(contact._id)), contact, new UpdateOptions { IsUpsert = true });
                return actionResult.IsAcknowledged;
                    //&& actionResult.ModifiedCount > 0;
            }

            _context.UBSurveys.InsertOne(contact);
            return true;
        }

        public IEnumerable<UBSurveyInfo> List(string channelID, int currentPage, int pageSize, string title, DateTime? startDate, DateTime? endDate, int? approveStatus, out long totalCount)
        {
            if (currentPage < 1)
            {
                totalCount = 0;
                return Enumerable.Empty<UBSurveyInfo>();
            }
            var _filterDef = Builders<UBSurveyInfo>.Filter.Eq(t => t.ChannelID, channelID);

            if (startDate.HasValue)
                _filterDef &= Builders<UBSurveyInfo>.Filter.Gte(t => t.StartDate, startDate.Value);

            if (endDate.HasValue)
                _filterDef &= Builders<UBSurveyInfo>.Filter.Lte(t => t.EndDate, endDate.Value.AddDays(1));

            if (approveStatus.HasValue)
                _filterDef &= Builders<UBSurveyInfo>.Filter.Eq(t => t.ApproveStatus, approveStatus.Value);

            if (!string.IsNullOrEmpty(title))
                _filterDef &= Builders<UBSurveyInfo>.Filter.Regex(t => t.Title, title);

            var sort = Builders<UBSurveyInfo>.Sort.Descending("_id");

            totalCount = _context.UBSurveys.Find(_filterDef).Count();
            return _context.UBSurveys.Find(_filterDef).Sort(sort).Skip((currentPage - 1) * pageSize).Limit(pageSize).ToEnumerable();
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

        public IEnumerable<UBServiceInfo> GetServices()
        {
            //var filter = Builders<UBServiceInfo>.Filter.Empty;
            var sort = Builders<UBServiceInfo>.Sort.Descending("_id");
            var filter = Builders<UBServiceInfo>.Filter.Eq("Visible", true);
            return _context.UBServices.Find(filter).Sort(sort).ToEnumerable();
        }

        public void DumpError(object o)
        {
            BsonDocument doc = BsonDocument.Parse(JsonConvert.SerializeObject(o));
            _context.ErrorDump.InsertOne(doc);
        }
    }
}