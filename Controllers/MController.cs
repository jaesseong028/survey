using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace UBSurvey.Controllers
{
    public class EditController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Prev(string survey)
        {
            ViewBag.survey = survey;
            return View();
        }
    }
}