using System;
using System.Collections.Generic;
using System.IO.Compression;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.WebEncoders;
using UBSurvey.Lib;
using UBSurvey.Repository;

namespace UBSurvey
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddResponseCompression();
            
            //services.AddTransient<ISurveysRepository, SurveysRepository>();

            //services.AddWebOptimizer();
            
            services.Configure<GzipCompressionProviderOptions>(options => 
            {
                options.Level = CompressionLevel.Fastest;
            });

            services.AddOptions();
            services.Configure<Settings>(options =>
            {
                options.ConnectionString = Configuration.GetSection("Settings:ConnectionString").Value;
                options.Database = Configuration.GetSection("Settings:Database").Value;
                options.ChanelID = Configuration.GetSection("Settings:ChanelID").Value;
                options.PageSize = int.Parse(Configuration.GetSection("Settings:PageSize").Value);
            });


            services.AddTransient<ISurveysRepository, SurveysRepository>();

            services.Configure<WebEncoderOptions>(options =>
            {
                options.TextEncoderSettings = new System.Text.Encodings.Web.TextEncoderSettings(System.Text.Unicode.UnicodeRanges.All);
            });

            services.AddMvc();
        }



        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            app.UseResponseCompression();
            
            
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

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "Survey",
                    template: "api/{controller=Survey}/{action=Index}");

                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });
        }
    }
}
