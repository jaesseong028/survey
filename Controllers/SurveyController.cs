
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


            //var 
            Validation.ConfirmParam(val);

            // confirm Date 
            // confirm ChannelID SurveyID MaxCount SurveyPeriod


            // SurveyID Encrypt



            return View();
        }
    }
}
