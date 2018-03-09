using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Diagnostics;
using System.Dynamic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Bson.IO;
using MongoDB.Bson.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using UBSurvey.Common;
using UBSurvey.Lib;
using UBSurvey.Models;
using UBSurvey.Repository;

namespace UBSurvey.Controllers.Api
{
    [Route("api/survey/[action]")]
    public class SurveyApiController : Controller
    {
        private readonly ISurveyRepository _repository;

        private readonly IOptions<GlobalVariable> _globalVariable;
        public SurveyApiController(ISurveyRepository repository, IOptions<GlobalVariable> globalVariable)
        {
            _repository = repository;
            _globalVariable =  globalVariable;
        }

        [HttpPost]
        public JsonResult Save([FromBody]SurveyInfo survey)
        {
            bool isSuccess =_repository.UpsertSurvey(survey);
            return Json(new { success = isSuccess,  data = survey });
        } 

        [HttpPost]
        public JsonResult GetSurvey([FromBody]JObject obj)
        {
            if(!obj.paramsValidation( "channelID", "surveyID"))
                return Json(new { success = false, message = "파라미터 오류입니다." });
            
            var data = _repository.GetSurvey((string)obj["channelID"], (string)obj["surveyID"]);
            if (data == null)
                return Json(new { data = data, success = false, message = "데이터를 조회 할 수 없습니다." });


            foreach (var r in data._surveyResult)
            {   
                var dd = r.GetType().GetProperties();
            }

            return Json(new { data = data, success = true});
        } 

        [HttpPost]
        public JsonResult RemoveSurvey([FromBody]JObject obj)
        {
            if(!obj.paramsValidation("channelID", "surveyID"))
                return Json(new { success = false, message = "파라미터 오류입니다." });
                
            var result = _repository.RemoveSurvey((string)obj["channelID"], (string)obj["surveyID"]);
            return Json(new { success = true, data = result });
        } 

        [HttpPost]
        public JsonResult GetSurveyResultCount([FromBody]JObject obj)
        {
            if(!obj.paramsValidation("channelID", "surveyID"))
                return Json(new { success = false, message = "파라미터 오류입니다." });

            var result = _repository.GetSurveyResultCount((string)obj["channelID"], (string)obj["surveyID"]);
            return Json(new { success = true, data = result });
        } 

        [HttpPost]
        public JsonResult ExistsUserToken([FromBody]JObject obj)
        {
            if(!obj.paramsValidation("channelID", "surveyID",  "userToken"))
                return Json(new { success = false, message = "파라미터 오류입니다." });

            var result = _repository.ExistsUserToken((string)obj["channelID"], (string)obj["surveyID"], (string)obj["userToken"]);
            return Json(new { success = true, data = result });
        } 

        [HttpPost]
        public JsonResult GetSurveyResult([FromBody]JObject obj)
        {
             if(!obj.paramsValidation( "channelID", "surveyID"))
                return Json(new { success = false, message = "파라미터 오류입니다." });
            
            var data = _repository.GetSurvey((string)obj["channelID"], (string)obj["surveyID"]);

            dynamic expando = new ExpandoObject();
            var p = expando as IDictionary<String, object>;
            p["A"] = "New val 1";
            p["B"] = "New val 2";

            string ss = expando.B;
            //data._surveyResult


            if (data == null)
                return Json(new { success = false, message = "데이터를 조회 할 수 없습니다." });
            return Json(new { data = data._surveyResult, success = true});
        } 
    }
}