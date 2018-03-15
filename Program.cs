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
            IWebHost host = WebHost.CreateDefaultBuilder(args)
                    .UseConfiguration(new ConfigurationBuilder()
                    .AddJsonFile("hosting.json", optional: true)
                    .Build()
            )
            .UseStartup<Startup>().Build();
            
            host.Run();
        }
    }
}
