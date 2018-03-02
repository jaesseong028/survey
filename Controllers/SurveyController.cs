
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
            val = "CreateDate=" + DateTime.Now.ToString("yyyyMMddHHmmss") + "&SurveyID=5a966daa3cffd28f8c770b40&userToken=CCCC";
            channelID = "5a8fb4200ad8963fa4242cb2";
            val = Helpers.AesEncrypt256(val,"#ltqdcpk$)#!_no1");
            string temp = "?val=" + val + "&" + "ChannelID=" + channelID;
            // ///////////////////////////////
            
            if(string.IsNullOrEmpty(val) || string.IsNullOrEmpty(channelID))
                throw new ArgumentNullException("Argument 가 존재하지 않습니다. Argument : Null " );

            
            

            var encryptKey = _repository.GetChannelEncryptKey(channelID);
            // Confirm Parameter 
            //NameValueCollection qscoll =  HttpUtility.ParseQueryString(Request.QueryString.ToString());
            NameValueCollection qscoll =  HttpUtility.ParseQueryString(temp);

            qscoll = Validation.ConfirmParam(qscoll, encryptKey);
            var surveyInfo = _repository.GetSurvey(qscoll["ChannelID"],qscoll["SurveyID"]);
            
            if(surveyInfo == null)
                throw new ArgumentNullException("Survey 가 존재하지 않습니다." );

            qscoll.Remove("CreateDate");

            V_ProgressInfo model = new V_ProgressInfo();
            model.Survey = surveyInfo.Survey;
            model._info = Helpers.AesEncrypt256( Helpers.ToQueryString(qscoll), _globalVariable.Value.SurveyEncyptKey);

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
