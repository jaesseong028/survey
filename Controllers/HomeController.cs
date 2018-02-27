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
            string sdd =  Helpers.AESEncrypt256("홍종표", "abcdefghijklmnopqrstuvwxyz123456");
            string sdd1 =  Helpers.AESEncrypt256("adfasd", "abcdefghijklmnopqrstuvwxyz123456");
            string sdd2 =  Helpers.AESEncrypt256("afddasfasdfsadfasd", "abcdefghijklmnopqrstuvwxyz123456");
            string sdd2223 =  Helpers.AESDecrypt256(sdd2, "abcdefghijklmnopqrstuvwxyz123456");
            string sdd132432 =  Helpers.AESDecrypt256(sdd1, "abcdefghijklmnopqrstuvwxyz123456");
            string sdd345435 =  Helpers.AESDecrypt256(sdd, "abcdefghijklmnopqrstuvwxyz123456");
            return View();

        }
    }
}
