using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using UBSurvey.Common;
using UBSurvey.Lib;
using UBSurvey.Models;
using UBSurvey.Repository;
using SSOCS;
using System.Dynamic;

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
        public IActionResult Result(string ubsurveyid = "5aa0ee2b9806b8b4f0c37ce2")
        {
            if (string.IsNullOrEmpty(ubsurveyid))
                return NotFound();
            
            var info = _repository.GetUBSurvey(ubsurveyid);
            if (info == null)
                return NotFound();

            if (string.IsNullOrEmpty(info.SurveyID))
                return NotFound();

            


            var r = Helpers.HttpPost($"{_globalVariable.Value.ApiDomain}/api/survey/GetSurvey",new { channelID = info.ChannelID, surveyID = info.SurveyID });
            var d = JsonConvert.DeserializeObject<dynamic>(r.Result);

            List<dynamic> list = new List<dynamic> ();
            foreach(var dd in d["data"]["_surveyResult"])
            {
                 list.Add(dd.Values.answer);
            }
            if( (bool)d["success"] && d["data"]["survey"] != null)
                 return View(list);
            else
                return NotFound();
        }

        public IActionResult List(int pageIndex = 1, string channelID = ""/* DateTime? startDate = null, DateTime? endDate = null, int approveStatus = 1*/)
        {
            //string ss =Helpers.GenerateKey(16);
            //var site = _globalVariable.Value.ApiDomain;
            // for(int i =0; i < 1; i++)
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
            //     string sadf = r1.Result;
            // }

            //string ss = Url.Action("/api/ubsurvey/list");

            IEnumerable<UBServiceInfo> services = _repository.GetServices();
            string url = $"{_globalVariable.Value.ApiDomain}/api/ubsurvey/list/{Request.QueryString.ToString()}";

            if (channelID == string.Empty)
            {
                channelID = services.First().ChannelID;
                var gubun = Request.QueryString.HasValue ? "&" : "?";
                url = url  + $"{gubun}channelID={channelID}";
            }

            var r = Helpers.HttpGet(url);
            dynamic d = JsonConvert.DeserializeObject(r.Result);
            if(!(bool)d["success"])
                return NotFound();

            var uri = new Uri(url);
            var newQueryString = HttpUtility.ParseQueryString(uri.Query);
            var searchData = Helpers.GetQueryStringToDictionary(uri.Query, "channelID", "title", "startDate", "endDate", "approveStatus");
            
            var pager = Pager.GetPageModel(pageIndex, _globalVariable.Value.PageSize, (int)d["totalCount"]);
            Tuple<object, object, object, object, object> tuple = new Tuple<object, object, object, object, object>(d["data"], pager, searchData, services, _globalVariable.Value.ApiDomain);
            return View(tuple);
        }


        // //////////////////////////////////// ///


        public IActionResult Edit(string ubsurveyid, string channelid)
        {
            UBSurveyEditInfo editInfo = new UBSurveyEditInfo();
            UBSurveyInfo info = new UBSurveyInfo()
            {
                StartDate = DateTime.Now,
                EndDate = DateTime.Now,
                ChannelID  = channelid
            };

            if( ubsurveyid != null)
            {
                info = _repository.GetUBSurvey(ubsurveyid);
                if(!string.IsNullOrEmpty(info.SurveyID))
                {
                    var r = Helpers.HttpPost($"{_globalVariable.Value.ApiDomain}/api/survey/GetSurvey",new { channelID = info.ChannelID, surveyID = info.SurveyID });
                    dynamic d = JsonConvert.DeserializeObject(r.Result);
                    if( (bool)d["success"] && d["data"]["survey"] != null )
                        editInfo.SurveyJson = d["data"]["survey"].ToString();
                }
            }
            
            if(string.IsNullOrEmpty(channelid))
                return NotFound();

            string returnUrl = $"{_globalVariable.Value.ApiDomain}/Home/SurveyEditSave";
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

        public IActionResult Index(string ubsurveyid)
        {
            // ubsurveyid 확인
            if(string.IsNullOrEmpty(ubsurveyid))
                return NotFound("Parameter가 누락 되었습니다.");


            var info = _repository.GetUBSurvey(ubsurveyid);
            if(info == null)
                return NotFound("Parameter가 유효하지 않습니다.");
            
            //기간 확인
            if(!Validation.ConfirmPeriod(DateTime.Now, info.StartDate, info.EndDate))
                return NotFound("기간이 종료 되었습니다.");

            // 전체 진행 수 확인
            var r = Helpers.HttpPost($"{_globalVariable.Value.ApiDomain}/api/survey/GetSurveyResultCount",new { channelID = info.ChannelID, surveyID = info.SurveyID});
            dynamic d = JsonConvert.DeserializeObject(r.Result);
            if(!(bool)d["success"])
                return NotFound("Count 오류.");
            else if(!((int)d["data"] >= info.LimitPersons))
                return NotFound("인원이 마감되었습니다.");
            string returnUrl = $"{_globalVariable.Value.ApiDomain}/Home/Complete";

            var val = $"AuthDate={DateTime.Now.ToString("yyyyMMddHHmmss")}&SurveyID={info.SurveyID}&retUrl={returnUrl}";
            var enVal = Helpers.AesEncrypt256(val,_globalVariable.Value.UserEncyptKey);

            return RedirectToAction("Progress","Survey",new{channelid = info.ChannelID, val = enVal});

        }

        public IActionResult Complete()
        {
            return View();
        }


        [HttpPost]
        public IActionResult SurveyEditSave(string survey)
        {
            ViewBag.survey = survey;
           
            return View();
        } 


    }
}
