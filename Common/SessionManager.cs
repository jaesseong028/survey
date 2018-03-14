
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace UBSurvey.Common
{
    public class SessionManager
    {
        public static string GetSession (ISession _session, string key = "UserName"){
            return _session.GetString(key);
        }

        public static void SetSession (ISession _session, string key, string value){
            _session.SetString(key,value);
        }

        public static void LogOut(ISession _session) {
            _session.Clear();
        }

        public static bool IsLogin(ISession _session, string key = "UserName")
        {
            if(GetSession(_session, key) == null)
                return false;
            else
                return true;
        }
    }

}