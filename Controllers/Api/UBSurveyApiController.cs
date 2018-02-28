using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Web;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json.Linq;
using UBSurvey.Common;
using UBSurvey.Lib;
using UBSurvey.Models;
using UBSurvey.Repository;

namespace UBSurvey.Controllers.Api
{
    [Route("api/ubsurvey/[action]")]
    public class UBSurveyApiController : Controller
    {
        private readonly IUBSurveyRepository _repository;

        private readonly IOptions<GlobalVariable> _globalVariable;

        public UBSurveyApiController(IUBSurveyRepository repository, IOptions<GlobalVariable> globalVariable)
        {
            _repository = repository;
            _globalVariable =  globalVariable;
        }


        const string PAGEINDEXKEY = "pageIndex";
        const string PAGESIZEKEY = "pageSize";
        [HttpGet]
        public JsonResult List(int pageIndex = 1, string title = null, DateTime? startDate = null, DateTime? endDate = null, int approveStatus = 1)
        {
            DateTime sDate = startDate.HasValue ? startDate.Value : new DateTime(1900, 1, 1);
            DateTime eDate = endDate.HasValue ? endDate.Value : DateTime.MaxValue;
            long totalCount = 0;
            
            IEnumerable<UBSurveyInfo> surveys = _repository.List(pageIndex, _globalVariable.Value.PageSize, title, sDate, eDate, approveStatus, out totalCount);
            return Json(new {success = true, data = surveys, totalCount = totalCount });
        } 

        [HttpPost]
        public JsonResult Delete([FromBody]JObject data)
        {
            var result = _repository.RemoveUBSurvey(data["id"].ToString());
            
            return Json(new {success = true, data = result});
        }
    }
}