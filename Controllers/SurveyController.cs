
using System;
using System.Collections.Specialized;
using System.Web;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using UBSurvey.Common;
using UBSurvey.Lib;
using UBSurvey.Models;
using UBSurvey.Repository;

namespace UBSurvey.Controllers
{
    public class SurveyController : Controller
    {
        private readonly ISurveyRepository _repository;
        private readonly IOptions<GlobalVariable> _globalVariable;
        public SurveyController(ISurveyRepository repository, IOptions<GlobalVariable> globalVariable)
        {
            _repository = repository;
            _globalVariable =  globalVariable;
        }

        public IActionResult Progress(string channelID, string val)
        {
            // ///////////////////////////////
            // 임시 파라미터
            val = "AuthDate=" + DateTime.Now.ToString("yyyyMMddHHmmss") + "&SurveyID=5a9e3a9d4b8ec158f8bf0620&userToken=CCCC";
            channelID = "5a8fb4200ad8963fa4242cb2";
            val = Helpers.AesEncrypt256(val,"#ltqdcpk$)#!_no1");
            string temp = "?val=" + val + "&" + "ChannelID=" + channelID;
            // ///////////////////////////////
            
            if(string.IsNullOrEmpty(val) || string.IsNullOrEmpty(channelID))
            {
                return NotFound("유효하지 않는 데이터 입니다.");
            }

            var encryptKey = _repository.GetChannelEncryptKey(channelID);
            string query = Helpers.AesDecrypt256(val, encryptKey);
            var dic = Helpers.GetQueryStringToDictionary(query, "userToken", "SurveyID", "AuthDate");
            bool isAuth = Validation.ConfirmAuthDate(dic["authdate"]);
            if(!isAuth)
            {
                return NotFound("유효하지 않는 데이터 입니다.");
            }

            if(!(dic.ContainsKey("usertoken") && dic.ContainsKey("surveyid") && dic.ContainsKey("authdate")))
            {
                return NotFound();
            }

            var surveyInfo = _repository.GetSurvey(channelID, dic["surveyid"]);

            if(surveyInfo == null){
                return NotFound();
            }

            dic.Remove("authdate");
            V_ProgressInfo model = new V_ProgressInfo();
            model.Survey = surveyInfo.Survey;
            model._info = Helpers.AesEncrypt256(Helpers.ToQueryString(dic), _globalVariable.Value.SurveyEncyptKey);

            return View(model);
        }


        [HttpPost]
        public JsonResult Complete( [FromBody] V_ProgressInfo result)
        {
            var deVal = Helpers.AesDecrypt256(result._info, _globalVariable.Value.SurveyEncyptKey);
            NameValueCollection qscoll =  HttpUtility.ParseQueryString(deVal);


            var surveyInfo = _repository.GetSurvey(qscoll["channelID"],qscoll["surveyID"]);
            
            if(surveyInfo == null )
                return Json(new { success = false});
            
            SurveyResult m_surveyResult = new SurveyResult(
            ){
                UserToken = qscoll["userToken"],
                Values = result._surveyResult
            };

            var isSuccess = _repository.InsertSurveyResult(qscoll["channelID"], qscoll["surveyID"], m_surveyResult);

            if(isSuccess)
                return Json(new { success = true, data = "result" });
            else
                return Json(new { success = false, data = "result" });
        } 

    }
}
