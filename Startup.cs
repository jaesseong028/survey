using System;
using System.Collections.Generic;
using System.IO.Compression;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Hosting.Server.Features;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.WebEncoders;
using Microsoft.AspNetCore.Http;
using UBSurvey.Lib;
using UBSurvey.Models;
using UBSurvey.Repository;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace UBSurvey
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddResponseCompression();
            
            //services.AddTransient<ISurveysRepository, SurveysRepository>();

            //services.AddWebOptimizer();

            services.Configure<GzipCompressionProviderOptions>(options => 
            {
                options.Level = CompressionLevel.Fastest;
            });

            Mapper.Initialize(cfg =>
            {
                cfg.CreateMap<UBSurveyInfo, UBSurveyListInfo>();
                cfg.CreateMap<SurveyInfo, SurveyInfoDTO>();
            }); 

            services.AddOptions();
            services.Configure<DBSettings>(options =>
            {
                options.ConnectionString = Configuration.GetSection("Settings:ConnectionString").Value;
                options.SurveyDatabase = Configuration.GetSection("Settings:SurveyDatabase").Value;
                options.UbSurveyDatabase = Configuration.GetSection("Settings:UbSurveyDatabase").Value;
            });

            services.Configure<GlobalVariable>(options =>
            {
                options.ChanelID = Configuration.GetSection("Settings:ChanelID").Value;
                options.PageSize = int.Parse(Configuration.GetSection("Settings:PageSize").Value);
                options.SurveyEncyptKey = Configuration.GetSection("Settings:SurveyEncyptKey").Value;
                options.UserEncyptKey = Configuration.GetSection("Settings:UserEncyptKey").Value;
            });

            services.AddTransient<ISurveyRepository, SurveyRepository>();
            services.AddTransient<IUBSurveyRepository, UBSurveyRepository>();

            services.Configure<WebEncoderOptions>(options =>
            {
                options.TextEncoderSettings = new System.Text.Encodings.Web.TextEncoderSettings(System.Text.Unicode.UnicodeRanges.All);
            });
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            var builder = services.AddMvc();
            builder.AddMvcOptions(o => { o.Filters.Add(typeof(GlobalExceptionFilter)); });
            builder.AddSessionStateTempDataProvider();
            services.AddDistributedMemoryCache();
            services.AddSession(options =>
            {
                options.Cookie.HttpOnly = true;
                options.Cookie.Name = "ucsp";
                options.IdleTimeout = TimeSpan.FromHours(3);
            });
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            app.UseResponseCompression();
            app.UseExceptionHandler("/Home/Error");
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }
            //app.UseWebOptimizer();
            app.UseStaticFiles();
            app.UseSession();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Login}/{action=Index}");

                routes.MapRoute(
                    name: "Survey",
                    template: "api/{controller=Survey}/{action=Index}");
            });
        }

        
    }
}
