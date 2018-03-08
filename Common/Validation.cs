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
    }
}