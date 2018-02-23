namespace UBSurvey.lib
{
    public class JsonDynamicWrapper
    {
        /// <summary>
        /// Dynamic json obj will be in d.
        /// 
        /// Send to server like:
        /// 
        /// { d: data }
        /// </summary>
        public dynamic data { get; set; }
    }
}