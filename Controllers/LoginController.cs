using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SSOCS;
using UBSurvey.Common;

namespace UBSurvey.Controllers
{
    public class LoginController : Controller
    {   
        public IActionResult index()
        {
            
            SessionManager.SetSession(HttpContext.Session,"UserName","정재성");

            return RedirectToAction("list","home");
        }

        public IActionResult SSOLogin(string token)
        {
            if(string.IsNullOrEmpty(token))
                return NotFound("Parameter가 유효하지 않습니다.");

            AppTokenCtl TokenCtl = new AppTokenCtl();
            try{
                AppToken at = TokenCtl.VerifyLoginToken(token);
                SessionManager.SetSession(HttpContext.Session,"UserName",at.UserName);
            }catch
            {
                return NotFound("로그인 실패");
            }

            return RedirectToAction("list","home");
        }   
    }
}