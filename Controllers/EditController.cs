using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using Newtonsoft.Json.Linq;
using UBSurvey.lib;
using UBSurvey.Lib;
using UBSurvey.Models;
using UBSurvey.Repository;

namespace UBSurvey.Controllers
{
    public class EditController : Controller
    {
        

        [HttpGet]
        public IActionResult Index ()
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