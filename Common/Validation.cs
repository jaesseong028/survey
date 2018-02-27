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
        public static NameValueCollection ConfirmParam(string channel, string val)
        {
            if(string.IsNullOrEmpty(val) || string.IsNullOrEmpty(channel))
                throw new ArgumentNullException("Argument 가 존재하지 않습니다. Argument : Null " );
            
            // get Channel EnKey

            // Decrypt val

            // 

            // val : CreateDate=20180227&SurveyID=AAAAAA&ChannelID=BBBBB&UserID=CCCCCC
            NameValueCollection qscoll = HttpUtility.ParseQueryString( "ChannelID=" + channel +"&"+ val);

            // CreateDate Check
            if(!string.IsNullOrEmpty(qscoll["CreateDate"]) && Helpers.IsDate(qscoll["CreateDate"],"yyyyMMddHHmmss"))
            {
                var nowDate = DateTime.Now;
                TimeSpan ts = nowDate - DateTime.ParseExact(qscoll["CreateDate"], "yyyyMMddHHmmss", CultureInfo.CurrentCulture);
                
                if( ts.TotalSeconds > 60)
                    throw new ArgumentException("시간 초과 하였습니다. Argument : CreateDate ");
            }
            else
            {
                throw new ArgumentException("잘 못된 형 식입니다. Argument : CreateDate" );
            }

            // Check SurveyID ChannelID
            if(string.IsNullOrEmpty(qscoll["SurveyID"]) || string.IsNullOrEmpty(qscoll["ChannelID"]))
                throw new ArgumentException("잘 못된 형 식입니다. Argument : SurveyID, ChannelID" );
            
            return qscoll;
        }
    }
}