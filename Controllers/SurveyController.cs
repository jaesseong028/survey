
using Microsoft.AspNetCore.Mvc;
using UBSurvey.Common;

namespace UBSurvey.Controllers
{
    public class SurveyController : Controller
    {
        public ActionResult Progress(string val)
        {
            // Parameter decrypt
            // Parameter Split


            val = "CreateDate=20180227132122&SurveyID=AAAAAA&ChannelID=BBBBB&UserID=CCCC";

            Validation.ConfirmParam(val);

            // confirm Date 
            // confirm ChannelID SurveyID MaxCount SurveyPeriod


            // SurveyID Encrypt



            return View();
        }
    }
}
