using System;
using System.Collections.Specialized;
using System.Globalization;
using System.Web;
using Microsoft.Extensions.Options;
using UBSurvey.Lib;
using UBSurvey.Repository;

namespace UBSurvey.Common
{
    public class Validation
    {

        public static bool ConfirmAuthDate(string authDate)
        {  
            if(!string.IsNullOrEmpty(authDate) && Helpers.IsDate(authDate,"yyyyMMddHHmmss"))
            {
                var nowDate = DateTime.Now;
                TimeSpan ts = nowDate - DateTime.ParseExact(authDate, "yyyyMMddHHmmss", CultureInfo.CurrentCulture);
                
                if( ts.TotalSeconds > 60)
                    return false;
            }
            else
            {
                return false;
            }

            return true;
        }

        public static bool ConfirmPeriod(DateTime c, DateTime s, DateTime e)
        {
        
             c = DateTime.Parse(c.ToShortDateString());
             s = DateTime.Parse(s.ToShortDateString());
             e = DateTime.Parse(e.ToShortDateString());
            TimeSpan ps = c- s;
            TimeSpan pe = c- e;

            if(ps.TotalDays >= 0 && pe.TotalDays <= 0 )
                return true;
                
            return false;
        }
    }
}