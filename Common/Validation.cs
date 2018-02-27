using System;
using System.Collections.Specialized;
using System.Globalization;
using System.Web;

namespace UBSurvey.Common
{
    public class Validation
    {
        public static void ConfirmParam(string val)
        {
            if(string.IsNullOrEmpty(val))
                throw new ArgumentNullException("Argument 가 존재하지 않습니다. Argument : Null " );

            // Parameter Descrypt
            // val : CreateDate=20180227&SurveyID=AAAAAA&ChannelID=BBBBB&UserID=CCCCCC
            NameValueCollection qscoll = HttpUtility.ParseQueryString(val);

            // CreateDate
            if(!string.IsNullOrEmpty(qscoll["CreateDate"]) && Helpers.IsDate(qscoll["CreateDate"],"yyyyMMddHHmmss"))
            {
                var nowDate = DateTime.Now;
                TimeSpan ts = nowDate - DateTime.ParseExact(qscoll["CreateDate"], "yyyyMMddHHmmss", CultureInfo.CurrentCulture);
                
                if( ts.TotalSeconds > 60)
                    throw new ArgumentException("시간 초과 하였습니다. Argument : CreateDate ");
            }

            


        }

        public bool isDate()
        {
            return true;
        }

    }
}