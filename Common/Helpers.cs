
using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.ComponentModel;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Sockets;
using System.Reflection;
using System.Runtime.Serialization.Json;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNetCore.Http;
using MongoDB.Bson;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace UBSurvey.Common
{
    public static class Helpers
    {
        public static string GetMyIp()
        {
            var host = Dns.GetHostEntry(Dns.GetHostName());
            foreach (var ip in host.AddressList)
            {
                if (ip.AddressFamily == AddressFamily.InterNetwork)
                {
                    return ip.ToString();
                }
            }
            throw new Exception("No network adapters with an IPv4 address in the system!");
        }
        public static string getEnumDescription(this Enum value)
        {
            FieldInfo fi = value.GetType().GetField(value.ToString());

            DescriptionAttribute[] attributes =
                (DescriptionAttribute[])fi.GetCustomAttributes(
                typeof(DescriptionAttribute),
                false);

            if (attributes != null &&
                attributes.Length > 0)
                return attributes[0].Description;
            else
                return value.ToString();
        }

        public static string GetRequestDoamin(this HttpRequest request)
        {
            return  request.Scheme +  System.Uri.SchemeDelimiter + request.Host;            
        }



        public static string GenerateKey(int iKeySize)
        {
            Random rand = new Random(); 
            string input = "abcdefghijklmnopqrstuvwxyz0123456789~!@#$%^&*()_+"; 
            var chars = Enumerable.Range(0, 16).Select(x => input[rand.Next(0, input.Length)]);
            return new string(chars.ToArray());
        }  

        public static string AesEncrypt256(string Input, string key)
        {
            
            RijndaelManaged aes = new RijndaelManaged();
            aes.KeySize = 256;
            aes.BlockSize = 128;
            aes.Mode = CipherMode.CBC;
            aes.Padding = PaddingMode.PKCS7;
            aes.Key = Encoding.UTF8.GetBytes(key);
            aes.IV = new byte[] { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 };

            var encrypt = aes.CreateEncryptor(aes.Key, aes.IV);
            byte[] xBuff = null;
            using (var ms = new MemoryStream())
            {
            using (var cs = new CryptoStream(ms, encrypt, CryptoStreamMode.Write))
            {
                byte[] xXml = Encoding.UTF8.GetBytes(Input);
                cs.Write(xXml, 0, xXml.Length);
            }

            xBuff = ms.ToArray();
            }

            String Output = Convert.ToBase64String(xBuff);
            Output = HttpUtility.UrlEncode(Output);
            return Output;
        }

        public static string AesDecrypt256(string Input, string key)
        {
            Input = HttpUtility.UrlDecode(Input);
            Input =  Input.Replace(" ", "+");
            RijndaelManaged aes = new RijndaelManaged();
            aes.KeySize = 256;
            aes.BlockSize = 128;
            aes.Mode = CipherMode.CBC;
            aes.Padding = PaddingMode.PKCS7;
            aes.Key = Encoding.UTF8.GetBytes(key);
            aes.IV = new byte[] { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 };

            var decrypt = aes.CreateDecryptor();
            byte[] xBuff = null;
            using (var ms = new MemoryStream())
            {
                using (var cs = new CryptoStream(ms, decrypt, CryptoStreamMode.Write))
                {
                    byte[] xXml = Convert.FromBase64String(Input);
                    cs.Write(xXml, 0, xXml.Length);
                }

                xBuff = ms.ToArray();
            }

            String Output = Encoding.UTF8.GetString(xBuff);
            return Output;
        }

        private static string SHA256Hash(string Input)
        {
            SHA256 sha = new SHA256Managed();
            byte[] hash = sha.ComputeHash(Encoding.UTF8.GetBytes(Input));

            StringBuilder stringBuilder = new StringBuilder();
            foreach (byte b in hash)
            {
                stringBuilder.AppendFormat("{0:x2}", b);
            }
            return stringBuilder.ToString();
        }

        private static string SHA512Hash(string Input)
        {
            SHA512Managed sha = new SHA512Managed();
            byte[] hash = sha.ComputeHash(Encoding.UTF8.GetBytes(Input));

            StringBuilder stringBuilder = new StringBuilder();
            foreach (byte b in hash)
            {
                stringBuilder.AppendFormat("{0:x2}", b);
            }
            return stringBuilder.ToString();
        }


        // ////////////////////////////
        // Description : Date Check
        // ////////////////////////////
        public static bool IsDate(string date, string format = "yyyy-MM-dd")
        {
            DateTime dt;
            return DateTime.TryParseExact(date, format, CultureInfo.CurrentCulture, DateTimeStyles.None, out dt);
        }

        private static readonly HttpClient client = new HttpClient();


        public static async Task<string> HttpGet(string url)
        {
           using(var httpClient = new HttpClient())
           {
                var response = await httpClient.GetAsync(url);
                var contents = await response.Content.ReadAsStringAsync();
                return contents;
           }
        }

        public static async Task<string> HttpPost(string url, object model)
        {
           using(var httpClient = new HttpClient())
           {
                //httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                var response = await httpClient.PostAsync(url, new StringContent(
                    JsonConvert.SerializeObject(model),
                    Encoding.UTF8,
                    "application/json"));
                var contents = await response.Content.ReadAsStringAsync();

                return contents;
           }
        }

        public static Dictionary<string, string> GetQueryStringToDictionary(string querystring, params string[] keys)
        {
            keys = keys.Select(q=> q.ToLower()).ToArray();
            NameValueCollection namedValues =  HttpUtility.ParseQueryString(querystring);
            Dictionary<string, string> dic = new Dictionary<string, string>();
            foreach(string key in namedValues.Keys)
            {
                if (key != null && keys.Contains(key.ToLower()))
                {
                    if(!string.IsNullOrEmpty(namedValues.GetValues(key).FirstOrDefault()))
                        dic.Add(key.ToLower(), namedValues.GetValues(key).First());
                }

            }
            return dic;
        }


        // ////////////////////////////////////////////////////////////////////////////
        public static string toQueryString(this NameValueCollection nvc)
        {
            var array = (from key in nvc.AllKeys
                from value in nvc.GetValues(key)
                select string.Format("{0}={1}", HttpUtility.UrlEncode(key), HttpUtility.UrlEncode(value)))
                .ToArray();
            return "?" + string.Join("&", array);
        }

        public static string toQueryString(this Dictionary<string, string> nvc)
        {
            var array = (from key in nvc.Keys
                        select string.Format("{0}={1}", HttpUtility.UrlEncode(key), HttpUtility.UrlEncode(nvc[key])))
                .ToArray();
            return "?" + string.Join("&", array);
        }

        public static string CreateUri(string root, NameValueCollection nvc)
        {
            var collection = HttpUtility.ParseQueryString(string.Empty);
            foreach (var key in nvc.Cast<string>().Where(key => !string.IsNullOrEmpty(nvc[key])))
            {
                collection[key] = nvc[key];
            }

            if(!string.IsNullOrEmpty(root) )
            {
                var builder = new UriBuilder(root) { Query = collection.ToString() };
                return builder.Uri.ToString();
            }
            
            return "?" + collection.ToString();   
        }

        // ////////////////////////////////////////////////////////////////////////////
        
        private static System.Text.RegularExpressions.Regex objectIdReplace = new System.Text.RegularExpressions.Regex(@"ObjectId\((.[a-f0-9]{24}.)\)", System.Text.RegularExpressions.RegexOptions.Compiled);
        /// <summary>
        /// deserializes this bson doc to a .net dynamic object
        /// </summary>
        /// <param name="bson">bson doc to convert to dynamic</param>
        public static dynamic ToDynamic(this BsonDocument bson)
        {
            var json = objectIdReplace.Replace(bson.ToJson(), (s) => s.Groups[1].Value);
            return Newtonsoft.Json.JsonConvert.DeserializeObject<dynamic>(json);
        }

        public static bool paramsValidation(this JObject obj, params string[] p)
        {
            if(obj == null)
                return false;
            foreach(var pr in p) 
            {
                if(obj[pr] == null)
                {
                    return false;
                }
            }
            return true;
        }
    }
}