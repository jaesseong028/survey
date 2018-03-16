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
using Newtonsoft.Json;

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
            // IEnumerable<UBSurveyListInfo> wrapperSurveys =  Enumerable.Empty<UBSurveyListInfo>();
            // if(surveys.FirstOrDefault() != null)
            // {
            //     wrapperSurveys = Mapper.Map<IEnumerable<UBSurveyInfo>, IEnumerable<UBSurveyListInfo>>(surveys);
            // }

            return Json(new {success = true, data = surveys, totalCount = totalCount });
        } 

        [HttpPost]
        public JsonResult Delete([FromBody]JObject data)
        {
            UBSurveyInfo info = _repository.GetUBSurvey(data["id"].ToString());
            if(info != null)
            {
                var result = _repository.RemoveUBSurvey(data["id"].ToString());
                if (result)
                {
                    if(string.IsNullOrEmpty(info.SurveyID))
                        return Json(new {success = true});    
                    string siteName = HttpContext.Request.GetRequestDoamin();
                    var r = Helpers.HttpPost($"{siteName}/api/survey/RemoveSurvey",new { channelID = info.ChannelID, surveyID = info.SurveyID });
                    var d = JsonConvert.DeserializeObject<dynamic>(r.Result);
                    
                    return Json(new {success = (bool)d["success"]});
                }
            }

            return Json(new {success = false});
        }

        // [HttpPost]
        // public JsonResult Save([FromBody]UBSurveyInfo data)
        // {   
        //     if (string.IsNullOrEmpty(data.ChannelID))
        //         return Json(new {success = false, message = "ChannelID 가 존재 하지 않습니다." });    
            
        //     bool isSuccess = _repository.UpSertUBSurvey(data);
        //     return Json(new {success = isSuccess });
        // }

        [HttpPost]
        public JsonResult Save([FromBody]UBSurveyEditInfo data)
        {   
            if (string.IsNullOrEmpty(data.Survey.ChannelID))
                return Json(new {success = false, message = "ChannelID 가 존재 하지 않습니다." });    
            
            if(data.SurveyInfo.Survey != null)
            {
                //survey save
                string siteName = HttpContext.Request.GetRequestDoamin();
                var r = Helpers.HttpPost($"{siteName}/api/survey/save", data.SurveyInfo);
                var d = JsonConvert.DeserializeObject<dynamic>(r.Result);
                if( (bool)d["success"] && d["data"] != null )
                    data.Survey.SurveyID = d["data"]["_id"].ToString();

            }

            bool isSuccess = _repository.UpSertUBSurvey(data.Survey);
            return Json(new {success = isSuccess });
        }
    }
}