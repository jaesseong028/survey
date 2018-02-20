using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using UBSurvey.Models;

namespace UBSurvey.Controllers
{
    public class EditController : Controller
    {
        [HttpPost, HttpGet]
        public IActionResult Index (SurveyParams p)
        {
            return View(p);
        }

        [HttpPost]
        public IActionResult Prev(string survey)
        {
            ViewBag.survey = survey;
            return View();
        }

        [HttpPost]
        public IActionResult Save(string survey)
        {
            return View();
        }        
    }
}