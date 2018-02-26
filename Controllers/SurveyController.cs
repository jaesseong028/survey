using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using UBSurvey.Lib;
using UBSurvey.Models;
using UBSurvey.Repository;

namespace UBSurvey.Controllers
{
    [Route("api/[controller]/[action]")]
    public class SurveyController : Controller
    {
        private readonly ISurveyRepository _repository;

        private readonly IOptions<GlobalVariable> _globalVariable;
        public SurveyController(ISurveyRepository repository, IOptions<GlobalVariable> globalVariable)
        {
            _repository = repository;
            _globalVariable =  globalVariable;
        }

        [HttpPost]
        public JsonResult Save([FromBody]JObject survey)
        {
            Models.SurveyInfo s = new SurveyInfo();
            s._chanelID = _globalVariable.Value.ChanelID;
            s.Survey = BsonDocument.Parse(survey.ToString());
            _repository.InsertSurvey(s);
             return Json(new {success = true});

            // IEnumerable<SurveyInfo> surveys = _repository.List(null, _settings.Value.ChanelID, 1, 10);
            // int dd = surveys.Count();

            // var dasdf = surveys.First();

            // var ddd = new ObjectId(dasdf.Id.ToString());

            // Task<SurveyInfo> ss = _repository.GetSurvey(ddd);

            // var data = BsonSerializer.Deserialize<dynamic>(ss.Result.Survey);

            // return Json(new {success = data});
        } 



    }
}