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

        public static NameValueCollection ConfirmParam(NameValueCollection qscoll, string encryptKey)
        {   
            //GetChannelEncryptKey
            if(string.IsNullOrEmpty(encryptKey))
                throw new ArgumentNullException("ChannelID 가 잘 못 되었습니다. Argument : ChannelID " );

            // Decrypt val
            string deVal = Helpers.AesDecrypt256(qscoll["val"],encryptKey);
            
            //  ChannelID=BBBBB& CreateDate=20180227&SurveyID=AAAAAA&UserID=CCCCCC
            qscoll.Add(HttpUtility.ParseQueryString(deVal));

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