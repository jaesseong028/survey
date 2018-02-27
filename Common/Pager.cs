
using System;

namespace UBSurvey.Common
{
    public class PagerModel
    {
        public int? First {get;set;}
        public int? Prev {get;set;}
        public int[] Pages {get;set;}
        public int? Next {get;set;}
        public int? Last {get;set;}
    }
    public class Pager
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
            if(current == 1)
            {
                p.First = null;
                p.Prev = null;
            }
            else
            {
                p.First = 1;
                p.Prev = (((current / pageSize) - 1) * pageSize) + 1;
            }

            var div = (totalCount / pageSize) + (totalCount % pageSize == 0 ? 0 : 1); 
            p.Last = (totalCount / pageSize) + (totalCount % pageSize == 0 ? 0 : 1); //525 / 10
            //Next


            return p;
        }
    }
}