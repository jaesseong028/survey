
using System;
using System.Collections.Generic;
using System.Linq;

namespace UBSurvey.Common
{
    public class PagerModel
    {
        public int PageIndex  { get; set;}
        public int? First { get; set;}
        public int? Prev { get; set;}
        public IEnumerable<int> Pages { get; set;}
        public int? Next { get; set;}
        public int? Last { get; set;}
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
         
            var lastPage = (totalCount / pageSize) + (totalCount % pageSize == 0 ? 0 : 1); 
            var currentFirstPage = (int)(Math.Floor((current - 1) / 10.0) * 10) + 1;
            var lastFirstPage = (int)(Math.Floor((lastPage - 1) / 10.0) * 10) + 1;

            if (current > 10)
            {
                p.First = 1;
                p.Prev = currentFirstPage - 10;
            }

            if (lastPage != 0 && current > lastPage)
                throw new ArgumentException($"잘못된 파라미터 입니다. 전체 페이지 수 보다 높습니다.");

            if (lastFirstPage > 0 && currentFirstPage != lastFirstPage)
            {
                p.Next = currentFirstPage + 10;
                p.Last = lastPage;
            }

            p.PageIndex = current;

            int count = 10;
            if (currentFirstPage + 10 >= lastPage){
                count = (lastPage - currentFirstPage)  + 1;
            }

            p.Pages = Enumerable.Range(currentFirstPage, count);

            return p;
        }
    }
}