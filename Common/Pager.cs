
using System;
using System.Collections.Generic;
using System.Linq;

namespace UBSurvey.Common
{
    public class PagerModel
    {
        public int? First {get;set;}
        public int? Prev {get;set;}
        public IEnumerable<int> Pages {get;set;}
        public int? Next {get;set;}
        public int? Last {get;set;}
    }
    public static class Pager
    {
        public static PagerModel GetPageModel(int current, int pageSize, int totalCount)
        {
            if (current < 1)
                throw new ArgumentException($"잘못된 파라미터 입니다. Argument : current");
            if (pageSize < 1)
                throw new ArgumentException($"잘못된 파라미터 입니다. Argument : pageSize");
            if (totalCount < 0)
                throw new ArgumentException($"잘못된 파라미터 입니다. Argument : totalCount");

            PagerModel p = new PagerModel();
            if (current > 1)
            {
                p.First = 1;
                p.Prev = (((current / pageSize) - 1) * pageSize) + 1;
            }

            var lastPage = (totalCount / pageSize) + (totalCount % pageSize == 0 ? 0 : 1); 

            var currentFirstPage = (int)(Math.Floor((current - 1) / 10.0) * 10) + 1;
            var lastFirstPage = (int)(Math.Floor((lastPage - 1) / 10.0) * 10) + 1;

            if (current > lastPage)
                throw new ArgumentException($"잘못된 파라미터 입니다. 전체 페이지 수 보다 높습니다.");

            if (currentFirstPage != lastFirstPage)
            {
                p.Next = currentFirstPage + 10;
                p.Last = lastPage;
            }

            p.Pages = Enumerable.Range(currentFirstPage, 10);

            return p;
        }
    }
}