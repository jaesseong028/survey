using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using UBSurvey.Common;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = true, Inherited = true)]
public class CustomAuthorizeAttribute : AuthorizeAttribute, IAuthorizationFilter
{
    public CustomAuthorizeAttribute()
    {
        
    }

    public void OnAuthorization(AuthorizationFilterContext context)
    {
        bool isAuthorized = SessionManager.IsLogin(context.HttpContext.Session);
        if (!isAuthorized)
        {
            context.Result = new StatusCodeResult((int)System.Net.HttpStatusCode.Forbidden);
            return;
        }
    }
}