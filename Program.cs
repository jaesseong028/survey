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
            var host = BuildWebHost(args);
            host.Run();


            // bool isService = true;
            // if (Debugger.IsAttached || args.Contains("--console"))
            // {
            //     isService = false;
            // }
            
            // if (isService)
            // {
            //     host.RunAsService();
            // }
            // else
            // {
            //     host.Run();
            // }
        }


        public static IWebHost BuildWebHost(string[] args) {
            
            return WebHost.CreateDefaultBuilder(args)
                    .ConfigureAppConfiguration(ConfigConfiguration)
                    .UseContentRoot(Directory.GetCurrentDirectory())
                    .UseConfiguration(new ConfigurationBuilder().AddJsonFile("hosting.json", optional: true)
                    .Build()
                    
            )
            .UseKestrel()
            .UseContentRoot(Directory.GetCurrentDirectory())
            .UseStartup<Startup>().Build();
            
        }
        static void ConfigConfiguration(WebHostBuilderContext ctx, IConfigurationBuilder config)
        {
                config.SetBasePath(Directory.GetCurrentDirectory())
                    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                    .AddJsonFile($"appsettings.{ctx.HostingEnvironment.EnvironmentName}.json", optional: true, reloadOnChange: true);

        }
    }
}