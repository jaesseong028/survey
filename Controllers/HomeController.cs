using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using UBSurvey.Common;
using UBSurvey.Lib;
using UBSurvey.Models;

namespace UBSurvey.Controllers
{
    public class HomeController : Controller
    {   
        private readonly IOptions<GlobalVariable> _globalVariable;

        public HomeController(IOptions<GlobalVariable> globalVariable)
        {
            _globalVariable =  globalVariable;
        }
        public IActionResult Index(int pageIndex = 1/* DateTime? startDate = null, DateTime? endDate = null, int approveStatus = 1*/)
        {

            var r = Helpers.HttpPost($"http://192.168.245.101:5000/api/ubsurvey/list{Request.QueryString.ToString()}");
            dynamic d = JsonConvert.DeserializeObject(r.Result);

            var searchData = Helpers.GetQueryStringToDictionary(Request.QueryString.ToString(), "title", "startDate", "endDate", "approveStatus");

            if(!(bool)d["success"])
                return NotFound();

            var pager = Pager.GetPageModel(pageIndex, _globalVariable.Value.PageSize, (int)d["totalCount"]);
            Tuple<object, object, object> tuple = new Tuple<object, object, object>(d["data"], pager, searchData);
            return View(tuple);
        }


        // //////////////////////////////////// ///
        public IActionResult DetailSurvey()
        {

            return View();
        }
    }
}
