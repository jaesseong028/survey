using System;
using System.Collections;
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
            if (!Validation.SurveyCheck(survey.Survey))
                return Json(new { success = false, message = "잘못된 설문 데이터 입니다." });
            bool isSuccess =_repository.UpsertSurvey(survey);
            return Json(new { success = isSuccess, data = survey });
        } 

        [HttpPost]
        public JsonResult GetSurvey([FromBody]JObject obj)
        {
            if(!obj.paramsValidation( "channelID", "surveyID"))
                return Json(new { success = false, message = "파라미터 오류입니다." });
            
            var data = _repository.GetSurvey((string)obj["channelID"], (string)obj["surveyID"]);
            if (data == null)
                return Json(new { data = data, success = false, message = "데이터를 조회 할 수 없습니다." });


            return Json(new { data = data, success = true});
        } 

        [HttpPost]
        public JsonResult GetSurveyResultsCounts([FromBody]JObject obj)
        {
            if(!obj.paramsValidation( "channelID", "surveyIDs"))
                return Json(new { success = false, message = "파라미터 오류입니다." });

            
            var surveyIDs = Newtonsoft.Json.JsonConvert.DeserializeObject<IEnumerable<string>>(obj["surveyIDs"].ToString());
            
            var data = _repository.GetSurveyResultsCounts((string)obj["channelID"], surveyIDs);
            if (data == null)
                return Json(new { data = data, success = false, message = "데이터를 조회 할 수 없습니다." });


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

            if (data == null)
                return Json(new { success = false, message = "데이터를 조회 할 수 없습니다." });

            List<dynamic> list = new List<dynamic>();
            List<string> keys = new List<string>();
            
            bool isUserTokenExists = data._surveyResult.Any(q=> q.UserToken != null);
            dynamic expandoKey = new ExpandoObject();
            var pp = expandoKey as IDictionary<String, object>;
            if (isUserTokenExists)
                pp["UserToken"] = "UserToken";
            foreach (var p in data.Survey.pages)
            {
                foreach(var e in p.elements)
                {
                    if (!keys.Contains(e.name))
                        keys.Add(e.name);
                    if(!pp.ContainsKey(e.name))
                        pp[e.name] = e.title;
                }
            }
            list.Add(expandoKey);

            foreach(var dd in data._surveyResult)
            {
                dynamic expando = new ExpandoObject();
                var p = expando as IDictionary<String, object>;
                if (isUserTokenExists)
                    p["UserToken"] = dd.UserToken;

                var dic = (IDictionary<String, object>)dd.Values;
                foreach(var k in keys)
                {
                    if (!dic.ContainsKey(k) ){
                        p[k] = null;
                    }
                }

                foreach (KeyValuePair<string, object> kvp in dd.Values)
                {
                    if (kvp.Value is ICollection)
                    {
                        var collection = (ICollection<Object>)kvp.Value;
                        p[kvp.Key] = string.Join(",", collection.Select(s=> s.ToJson().Replace("\"", "").Replace("{", "").Replace("}", "")));
                    }
                    else
                    {
                        p[kvp.Key] = kvp.Value.ToString();
                    }
                }

                list.Add(expando);
            }
            
            return Json(new { data = list, success = true});
        } 
    }
}