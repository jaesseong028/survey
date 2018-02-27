
using System;
using System.Collections.Specialized;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using UBSurvey.Common;
using UBSurvey.Lib;
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

        public IActionResult Progress(string val)
        {

            val = "CreateDate=" + DateTime.Now.ToString("yyyyMMddHHmmss") + "&SurveyID=5a8fccc17622f83fe899c6ec&ChannelID=5a8fb4200ad8963fa4242cb2&UserID=CCCC";

            // Confirm Parameter 
            NameValueCollection qscoll = Validation.ConfirmParam(val);

            var surveyInfo = _repository.GetSurvey(qscoll["ChannelID"],qscoll["SurveyID"]);

            return View(surveyInfo);
        }

        
    }
}
