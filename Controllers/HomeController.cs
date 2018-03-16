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
using AutoMapper;

namespace UBSurvey.Controllers
{
    ///[CustomAuthorize]
    public class HomeController : Controller
    {   
        private readonly IUBSurveyRepository _repository;
        private readonly IOptions<GlobalVariable> _globalVariable;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private ISession _session => _httpContextAccessor.HttpContext.Session;
        public HomeController(IUBSurveyRepository repository, IOptions<GlobalVariable> globalVariable, IHttpContextAccessor httpContextAccessor)
        {
            _repository = repository;
            _globalVariable =  globalVariable;
            _httpContextAccessor = httpContextAccessor;
        }
        public IActionResult Result(string ubsurveyid)
        {
            string siteName = HttpContext.Request.GetRequestDoamin();
            if (!SessionManager.IsLogin(_session))
            {
                return RedirectToAction("required", "login");
            }

            if (string.IsNullOrEmpty(ubsurveyid))
                return NotFound();
            
            var info = _repository.GetUBSurvey(ubsurveyid);
            if (info == null)
                return NotFound();

            if (string.IsNullOrEmpty(info.SurveyID))
                return NotFound();
                

            var r = Helpers.HttpPost($"{siteName}/api/survey/GetSurveyResult",new { channelID = info.ChannelID, surveyID = info.SurveyID });
            var d = JsonConvert.DeserializeObject<dynamic>(r.Result);

            if( (bool)d["success"] && d["data"] != null)
            {
                 Tuple<dynamic, string> tuple = new Tuple<dynamic, string>(d["data"], info.Title);
                 return View(tuple);
            }
            else
                return NotFound();
        }

        public IActionResult Error(int pageIndex = 1)
        {
            if (!SessionManager.IsLogin(_session))
            {
                return RedirectToAction("required", "login");
            }
            int totalCount;
            var Data = _repository.ErrorDumpList(pageIndex, _globalVariable.Value.PageSize, out totalCount);
            var pager = Pager.GetPageModel(pageIndex, _globalVariable.Value.PageSize, totalCount);

            Tuple<object, object> tuple = new Tuple<object, object>(Data, pager);

            return View(tuple);
        }

        public IActionResult List(int pageIndex = 1, string channelID = ""/* DateTime? startDate = null, DateTime? endDate = null, int approveStatus = 1*/)
        {
            if (!SessionManager.IsLogin(_session))
            {
                return RedirectToAction("required", "login");
            }

            string siteName = HttpContext.Request.GetRequestDoamin();

            IEnumerable<UBServiceInfo> services = _repository.GetServices(SessionManager.GetSession(_session));
            if(services.Count() == 0)
                return NotFound();

            string url = $"{siteName}/api/ubsurvey/list/{Request.QueryString.ToString()}";

            if (channelID == string.Empty)
            {
                channelID = services.First().ChannelID;
                var gubun = Request.QueryString.HasValue ? "&" : "?";
                url = url  + $"{gubun}channelID={channelID}";
            }

            var r = Helpers.HttpGet(url);
            dynamic d = JsonConvert.DeserializeObject(r.Result);
            IEnumerable<UBSurveyInfo> data = JsonConvert.DeserializeObject<IEnumerable<UBSurveyInfo>>(d["data"].ToString());
            var SurveyIDs = data.Where(q=> q.SurveyID != null).Select(s=> s.SurveyID);
            var r1 = Helpers.HttpPost($"{siteName}/api/survey/GetSurveyResultsCounts",new { channelID = channelID, surveyIDs = SurveyIDs});

            IEnumerable<UBSurveyListInfo> wrUbSurveys =  Enumerable.Empty<UBSurveyListInfo>();
            if(data.FirstOrDefault() != null)
            {
                wrUbSurveys = Mapper.Map<IEnumerable<UBSurveyInfo>, IEnumerable<UBSurveyListInfo>>(data);
            }


            dynamic jData = JsonConvert.DeserializeObject(r1.Result);
            IEnumerable<SurveyResultCountInfo> countsInfo = JsonConvert.DeserializeObject<IEnumerable<SurveyResultCountInfo>>(jData["data"].ToString());

            foreach(var w in wrUbSurveys)
            {
                var s = countsInfo.FirstOrDefault(q=> q._id == w.SurveyID);
                if(s != null)
                    w.ResultCount = s.Counts;
            }


            if(!(bool)d["success"])
                return NotFound();

            var uri = new Uri(url);
            var newQueryString = HttpUtility.ParseQueryString(uri.Query);
            var searchData = Helpers.GetQueryStringToDictionary(uri.Query, "channelID", "title", "startDate", "endDate", "approveStatus");
            
            var pager = Pager.GetPageModel(pageIndex, _globalVariable.Value.PageSize, (int)d["totalCount"]);
            Tuple<object, object, object, object, object> tuple = new Tuple<object, object, object, object, object>(wrUbSurveys, pager, searchData, services, siteName);
            return View(tuple);
        }


        // //////////////////////////////////// ///


        public IActionResult Edit(string ubsurveyid, string channelid)
        {
            if (!SessionManager.IsLogin(_session))
            {
                return RedirectToAction("required", "login");
            }

            string siteName = HttpContext.Request.GetRequestDoamin();
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
                    var r = Helpers.HttpPost($"{siteName}/api/survey/GetSurvey",new { channelID = info.ChannelID, surveyID = info.SurveyID });
                    dynamic d = JsonConvert.DeserializeObject(r.Result);
                    if( (bool)d["success"] && d["data"]["survey"] != null )
                        editInfo.SurveyInfo = JsonConvert.DeserializeObject<SurveyInfo>(d["data"].ToString());
                }
            }
            
            if(string.IsNullOrEmpty(channelid))
                return NotFound();
            
            UBServiceInfo service = _repository.GetService(channelid);
            if(service == null)
                return NotFound("channel이 존재하지 않습니다.");
            
            editInfo.ChannelName = service.Desript;
            editInfo.SurveyInfo._channelID = channelid;
            
            string returnUrl = $"{siteName}/Home/SurveyEditSave";
            NameValueCollection namedValues =  new NameValueCollection
            {
                {"channelid" , channelid },
                {"surveyid", info.SurveyID},
                {"retUrl" , returnUrl },
            };
            editInfo.UrlParameter = Helpers.CreateUri("",namedValues);
            editInfo.Survey = info;

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


            string siteName = HttpContext.Request.GetRequestDoamin();

            // 전체 진행 수 확인
            var r = Helpers.HttpPost($"{siteName}/api/survey/GetSurveyResultCount",new { channelID = info.ChannelID, surveyID = info.SurveyID});
            dynamic d = JsonConvert.DeserializeObject(r.Result);
            if(!(bool)d["success"])
                return NotFound("Count 오류.");
            else if(((int)d["data"] >= info.LimitPersons))
                return NotFound("인원이 마감되었습니다.");
      
                
            string returnUrl = $"{siteName}/Home/Complete";

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

            // if (!SessionManager.IsLogin(_session))
            // {
            //     return RedirectToAction("required", "login");
            // }
            
            ViewBag.survey = survey;
           
            return View();
        } 
    }
}
