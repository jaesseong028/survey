
using System;
using Microsoft.AspNetCore.Mvc;
using UBSurvey.Common;

namespace UBSurvey.Controllers
{
    public class SurveyController : Controller
    {
        public ActionResult Progress(string val)
        {

            val = "CreateDate=" + DateTime.Now.ToString("yyyyMMddHHmmss") + "&SurveyID=5a93c33c84b0556c74c3a788&ChannelID=5a8fb4200ad8963fa4242cb2&UserID=CCCC";

            // Parameter decrypt
            // Parameter Split
            Validation.ConfirmParam(val);

            // confirm Date 
            // confirm ChannelID SurveyID MaxCount SurveyPeriod


            // SurveyID Encrypt



            return View();
        }
    }
}
