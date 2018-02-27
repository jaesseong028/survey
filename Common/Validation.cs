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
            





        }

    }
}