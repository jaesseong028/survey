using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace UBSurvey.Controllers
{
    public class MController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}