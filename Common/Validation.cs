using System;
using System.Collections.Specialized;
using System.Globalization;

namespace UBSurvey.Common
{
    public class Validation
    {
        public static void ConfirmParam(string val)
        {
            if(string.IsNullOrEmpty(val))
            {
                // Pameter Check IsNullOrEmpty
            }

            // Parameter Descrypt
            // val : CreateDate=20180227&SurveyID=AAAAAA&ChannelID=BBBBB&UserID=CCCCCC
            string[] splitValue = val.Split('&');
 
            NameValueCollection paramCol = new NameValueCollection();
            foreach(var value in splitValue)
            {
                string[] item = value.Split('=');
                if(item.Length == 2)
                {
                    paramCol.Add(item[0],item[1]);
                }
            }

            // Parameter Validation
            if(!string.IsNullOrEmpty(paramCol["CreateDate"]) && Helpers.IsDate(paramCol["CreateDate"]))
            {
                var nowDate = DateTime.Now; //.ToString("yyyyMMddHHmmss");
                TimeSpan ts = nowDate - DateTime.ParseExact(paramCol["CreateDate"], "yyyyMMddHHmmss", CultureInfo.InvariantCulture); ;
            }
            

            

            //cparam.Add(splitValue[0].Split('=')[0],splitValue[0].Split('=')[1]);

            //cparam.Add(,splitValue[0].Split['=']);





        }

        public bool isDate()
        {
            return true;
        }

    }
}