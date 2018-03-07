using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using UBSurvey.Common;
using UBSurvey.Lib;
using UBSurvey.Models;
using UBSurvey.Repository;

namespace UBSurvey.Controllers
{
    public class HomeController : Controller
    {   
        private readonly IUBSurveyRepository _repository;

        private readonly IOptions<GlobalVariable> _globalVariable;

        public HomeController(IUBSurveyRepository repository, IOptions<GlobalVariable> globalVariable)
        {
            _repository = repository;
            _globalVariable =  globalVariable;
        }
        public IActionResult Index(int pageIndex = 1/* DateTime? startDate = null, DateTime? endDate = null, int approveStatus = 1*/)
        {
            //string ss =Helpers.GenerateKey(16);
            var site = Helpers.GetMyIp() + ":5000";
            // for(int i =0; i < 100; i++)
            // {
            //     UBSurveyInfo s = new UBSurveyInfo();
            //     s.SurveyID = "5a9e290f2713a086b8a57a7b";
            //     s.Title = "title" + i.ToString();
            //     s.ChannelID = "5a8fb4200ad8963fa4242cb2";
            //     s.ApproveStatus = (short)(new Random()).Next(0, 1);
            //     s.StartDate = DateTime.Now.AddDays((new Random()).Next(-100, 100));
            //     s.EndDate = s.StartDate.AddDays((new Random()).Next(0, 100));
            //     s.LimitPersons = (new Random()).Next(0, 1000);
            //     var r1 = Helpers.HttpPost($"http://{site}/api/ubsurvey/save", s);  
            // }

            //string ss = Url.Action("/api/ubsurvey/list");
            var r = Helpers.HttpGet($"http://{site}/api/ubsurvey/list{Request.QueryString.ToString()}");
            dynamic d = JsonConvert.DeserializeObject(r.Result);

            var searchData = Helpers.GetQueryStringToDictionary(Request.QueryString.ToString(), "title", "startDate", "endDate", "approveStatus");

            if(!(bool)d["success"])
                return NotFound();

            var pager = Pager.GetPageModel(pageIndex, _globalVariable.Value.PageSize, (int)d["totalCount"]);
            Tuple<object, object, object> tuple = new Tuple<object, object, object>(d["data"], pager, searchData);
            return View(tuple);
        }


        // //////////////////////////////////// ///
        public IActionResult Edit(string surveyid, string channelid)
        {
            var site = Helpers.GetMyIp() + ":5000";

            UBSurveyEditInfo editInfo = new UBSurveyEditInfo();
            UBSurveyInfo info = new UBSurveyInfo()
            {
                StartDate = DateTime.Now,
                EndDate = DateTime.Now,
                ChannelID  = channelid
            };

            if( surveyid != null)
                info = _repository.GetUBSurvey(surveyid);
            
            string returnUrl = "http://"+ site + "/Home/SurveyEditSave";
            NameValueCollection namedValues =  new NameValueCollection
            {
                {"channelid" , channelid },
                {"surveyid", info.SurveyID},
                {"retUrl" , returnUrl },
            };
            editInfo.UrlParameter = Helpers.CreateUri("",namedValues);
            editInfo.survey = info;

            return View(editInfo);
        }

        [HttpPost]
        public IActionResult SurveyEditSave(string survey)
        {
            ViewBag.survey = survey;
           
            return View();
        } 


    }
}
