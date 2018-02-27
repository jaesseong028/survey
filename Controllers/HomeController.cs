using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using UBSurvey.Common;
using UBSurvey.Models;

namespace UBSurvey.Controllers
{
    public class HomeController : Controller
    {   
        public IActionResult Index()
        {
            

            return View();
        }
    }
}
