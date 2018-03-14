using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using UBSurvey.Common;

namespace UBSurvey
{
    public class Program
    {
        public static void Main(string[] args)
        {
            BuildWebHost(args);
        }


        public static void BuildWebHost(string[] args) {
            bool isService = true;
            if (Debugger.IsAttached || args.Contains("--console"))
            {
                isService = false;
            }

             var pathToContentRoot = Directory.GetCurrentDirectory();
            if (isService)
            {
                var pathToExe = Process.GetCurrentProcess().MainModule.FileName;
                pathToContentRoot = Path.GetDirectoryName(pathToExe);
            }
            IWebHost host = null;
            string myIP = Helpers.GetMyIp();
            if (isService)
            {
                host = WebHost.CreateDefaultBuilder(args)
                    .UseContentRoot(pathToContentRoot)
                    .UseConfiguration(new ConfigurationBuilder()
                    .SetBasePath(Directory.GetCurrentDirectory())
                    .AddJsonFile("hosting.json", optional: true)
                    .Build()
                )
                .UseStartup<Startup>()
                //.UseUrls($"http://{myIP}:5000/")
                .Build();
            }
            else
            {
                host = WebHost.CreateDefaultBuilder(args)
                    .UseContentRoot(pathToContentRoot)
                    .UseConfiguration(new ConfigurationBuilder()
                    .SetBasePath(Directory.GetCurrentDirectory())
                    .Build()
                )
                .UseStartup<Startup>()
                .UseUrls($"http://{myIP}:5000/", "http://locahost:5000")
                .Build();
            }

            if(isService)
            {
                host.Run();
                //host.RunAsService();
            }else
            {
                host.Run();
            }
        }
    }
}
