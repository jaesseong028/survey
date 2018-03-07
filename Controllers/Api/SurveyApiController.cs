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
        public JsonResult Save([FromBody]JObject survey)
        {
            SurveyInfo s = new SurveyInfo();
            s.Survey = BsonDocument.Parse(survey.ToString());
            SurveyInfo ret =_repository.UpsertSurvey(s);
            Console.WriteLine(ret._id);
            return Json(new { success = ret != null });
        } 

        [HttpGet]
        public JsonResult GetSurvey(string channelID, string surveyID)
        {
            var data = _repository.GetSurvey(channelID, surveyID);
            if (data == null)
                return Json(new { data = data, success = false, message = "조회불가" });
            return Json(new { data = data, success = true});
        } 

        [HttpGet]
        public JsonResult RemoveSurvey(string channelID, string surveyID)
        {
            var result = _repository.RemoveSurvey(channelID, surveyID);
            return Json(new { success = true, data = result });
        } 

        [HttpGet]
        public JsonResult GetSurveyResultCount(string channelID, string surveyID)
        {
            var result = _repository.GetSurveyResultCount(channelID, surveyID);
            return Json(new { success = true, data = result });
        } 

        [HttpGet]
        public JsonResult ExistsUserToken(string channelID, string surveyID, string userToken)
        {
            var result = _repository.ExistsUserToken(channelID, surveyID, userToken);
            return Json(new { success = true, data = result });
        } 

        //             ////////////////////////////////////////////////////////   
    }

}