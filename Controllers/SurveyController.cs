
using Microsoft.AspNetCore.Mvc;

namespace UBSurvey.Controllers
{
    public class SurveyController : Controller
    {
        public ActionResult Progress()
        {
            return View();
        }
    }
}