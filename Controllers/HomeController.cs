﻿using System;
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
            //string ss =Helpers.GenerateKey(16);
            // for(int i =0; i < 100; i++)
            // {
            //     UBSurveyInfo s = new UBSurveyInfo();
            //     s.SurveyID = "5a8fccc17622f83fe899c6ec";
            //     s.Title = "title" + i.ToString();
            //     s.ApproveStatus = (short)(new Random()).Next(0, 1);
            //     s.StartDate = DateTime.Now.AddDays((new Random()).Next(-100, 100));
            //     s.EndDate = s.StartDate.AddDays((new Random()).Next(0, 100));
            //     s.LimitPersons = (new Random()).Next(0, 1000);
            //     var r1 = Helpers.HttpPost("http://192.168.245.101:5000/api/ubsurvey/save", s);  
            // }

            var r = Helpers.HttpGet($"http://192.168.245.101:5000/api/ubsurvey/list{Request.QueryString.ToString()}");
            dynamic d = JsonConvert.DeserializeObject(r.Result);

            var searchData = Helpers.GetQueryStringToDictionary(Request.QueryString.ToString(), "title", "startDate", "endDate", "approveStatus");

            if(!(bool)d["success"])
                return NotFound();

            var pager = Pager.GetPageModel(pageIndex, _globalVariable.Value.PageSize, (int)d["totalCount"]);
            Tuple<object, object, object> tuple = new Tuple<object, object, object>(d["data"], pager, searchData);
            return View(tuple);
        }


        // //////////////////////////////////// ///
        public IActionResult Edit()
        {

            return View();
        }
    }
}
