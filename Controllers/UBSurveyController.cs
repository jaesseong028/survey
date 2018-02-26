using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json.Linq;
using UBSurvey.Lib;
using UBSurvey.Models;
using UBSurvey.Repository;

namespace UBSurvey.Controllers
{
    [Route("api/[controller]/[action]")]
    public class UBSurveyController : Controller
    {
        private readonly IUBSurveyRepository _repository;

        private readonly IOptions<GlobalVariable> _globalVariable;

        public UBSurveyController(IUBSurveyRepository repository, IOptions<GlobalVariable> globalVariable)
        {
            _repository = repository;
            _globalVariable =  globalVariable;
        }


        const string PAGEINDEXKEY = "pageIndex";
        const string PAGESIZEKEY = "pageSize";
        [HttpGet]
        public JsonResult List(int pageIndex = 1, DateTime? startDate = null, DateTime? endDate = null, int approveStatus = 1)
        {
            DateTime sDate = startDate.HasValue ? startDate.Value : new DateTime(1900, 1, 1);
            DateTime eDate = endDate.HasValue ? endDate.Value : DateTime.MaxValue;
            
            IEnumerable<UBSurveyInfo> surveys = _repository.List(pageIndex, _globalVariable.Value.PageSize, sDate, eDate, approveStatus);

            _repository.InsertUBSurvey(new UBSurveyInfo(){ Title = "유비케어2", StartDate = new DateTime(2017, 9, 10), EndDate = new DateTime(2017, 12, 31), ApproveStatus = 1, LimitPersons = 10 });

            return Json(new {success = true, data = surveys });

            // IEnumerable<SurveyInfo> surveys = _repository.List(null, _settings.Value.ChanelID, 1, 10);
            // int dd = surveys.Count();

            // var dasdf = surveys.First();

            // var ddd = new ObjectId(dasdf.Id.ToString());

            // Task<SurveyInfo> ss = _repository.GetSurvey(ddd);

            // var data = BsonSerializer.Deserialize<dynamic>(ss.Result.Survey);

            // return Json(new {success = data});
        } 

        [HttpPost]
        public JsonResult Delete(string id)
        {
            return Json(new {success = true});
        }
    }
}