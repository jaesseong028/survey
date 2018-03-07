using System;
using System.Linq;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Web;
using AutoMapper;
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
        public JsonResult List(string channelID, int pageIndex = 1, string title = null, DateTime? startDate = null, DateTime? endDate = null, int? approveStatus = null)
        {
            long totalCount = 0;
            
            IEnumerable<UBSurveyInfo> surveys = _repository.List(channelID, pageIndex, _globalVariable.Value.PageSize, title, startDate, endDate, approveStatus, out totalCount);
            IEnumerable<UBSurveyListInfo> wrapperSurveys =  Enumerable.Empty<UBSurveyListInfo>();
            if(surveys.FirstOrDefault() != null)
            {
                wrapperSurveys = Mapper.Map<IEnumerable<UBSurveyInfo>, IEnumerable<UBSurveyListInfo>>(surveys);
            }

            return Json(new {success = true, data = wrapperSurveys, totalCount = totalCount });
        } 

        [HttpPost]
        public JsonResult Delete([FromBody]JObject data)
        {
            var result = _repository.RemoveUBSurvey(data["id"].ToString());
            
            return Json(new {success = true, data = result});
        }

        [HttpPost]
        public JsonResult Save([FromBody]UBSurveyInfo data)
        {   
            if (string.IsNullOrEmpty(data.ChannelID))
                return Json(new {success = false, message = "ChannelID 가 존재 하지 않습니다." });    
                
            if (data == null)
                return Json(new {success = isSuccess });    
            bool isSuccess = _repository.UpSertUBSurvey(data);
            return Json(new {success = isSuccess });
        }
    }
}