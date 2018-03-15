using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.Routing;
using UBSurvey.Repository;

public class GlobalExceptionFilter : IExceptionFilter
{
    private readonly IUBSurveyRepository _repository;

    public GlobalExceptionFilter(IUBSurveyRepository repository)
    {
        _repository = repository;
    }
   public void OnException(ExceptionContext context)
   {
        var urlHelper = new UrlHelper(context);
        var url = urlHelper.RouteUrl(context.RouteData.Values);
        ErrorDumpInfo dump = new ErrorDumpInfo()
        {
            Message = context.Exception.Message,
            StackTrace = context.Exception.StackTrace,
            URL = url,
            CreateDate = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc)
        };

        var pageMessage = new 
        {
            Message = "예기치 않는 문제 발생",
        };

        context.Result = new ObjectResult(pageMessage)
        {
            StatusCode = 500,
            DeclaredType = typeof(object)
        };

        try{
            _repository.DumpError(dump);
        }catch{

        }
   } 
}