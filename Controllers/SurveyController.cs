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
        private readonly ISurveysRepository _repository;

        private readonly IOptions<Settings> _settings;
        public SurveyController(ISurveysRepository repository, IOptions<Settings> settings)
        {
            _repository = repository;
            _settings =  settings;
        }

        [HttpPost]
        public JsonResult Save([FromBody]JObject survey)
        {
            Models.SurveyInfo s = new SurveyInfo();
            s._chanelID = _settings.Value.ChanelID;
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

        const string PAGEINDEXKEY = "pageIndex";
        const string PAGESIZEKEY = "pageSize";
        [HttpGet]
        public JsonResult List()
        {
            NameValueCollection parameters = HttpUtility.ParseQueryString(Request.QueryString.ToString());
            int pageIndex = 1;
            int.TryParse(parameters[PAGEINDEXKEY], out pageIndex);

            int pageSize = 0;
            int.TryParse(parameters[PAGESIZEKEY], out pageSize);

            parameters.Remove(PAGEINDEXKEY);
            parameters.Remove(PAGESIZEKEY);
            
            if (pageSize < 1) 
                pageSize = _settings.Value.PageSize;

            var dict = parameters.AllKeys.ToDictionary(k => k, v => parameters[v]);
            string filterJson = JsonConvert.SerializeObject(dict);

            IEnumerable<SurveyInfo> surveys = _repository.List(filterJson, _settings.Value.ChanelID, pageIndex, pageSize);

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