using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Diagnostics;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using Newtonsoft.Json.Linq;
using UBSurvey.Common;
using UBSurvey.lib;
using UBSurvey.Lib;
using UBSurvey.Models;
using UBSurvey.Repository;

namespace UBSurvey.Controllers
{
    public class EditController : Controller
    {
        private readonly ISurveyRepository _repository;
        public EditController(ISurveyRepository repository){
            _repository = repository;
        }
        
        [HttpGet]
        public IActionResult Index (string channelID, string val)
        {
            if(channelID == null || val == null)
                return NotFound();
            var encryptKey = _repository.GetChannelEncryptKey(channelID);
            string query = Helpers.AesDecrypt256(val, encryptKey);
            var dic = Helpers.GetQueryStringToDictionary(query, "channelID", "surveyID", "AuthDate");
            if(!(dic.ContainsKey("channelid") && dic.ContainsKey("channelid") && dic.ContainsKey("authdate")))
            {
                return NotFound();
            }


            return View();
        }

        [HttpPost]
        public IActionResult Prev(string survey)
        {
            ViewBag.survey = survey;
            return View();
        }       
    }
}