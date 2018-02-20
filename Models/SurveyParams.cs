using System;

namespace UBSurvey.Models
{
    public class SurveyParams
    {
        public string _chanelID { get; set;}
        public DateTime? _startDate { get; set;}
        public  DateTime? _endDate { get; set;}
        public int _limit { get; set;}
        public string _bizData { get; set;}
    }
}