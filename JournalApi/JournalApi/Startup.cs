using System;
using System.Diagnostics.CodeAnalysis;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
using AutoMapper;

using JournalApi.Database;
using JournalApi.Services.Abstract;
using JournalApi.Services;

namespace JournalApi
{
    [ExcludeFromCodeCoverage]
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
            services.Configure<DbConfig>(Configuration.GetSection(nameof(DbConfig)));
            services.AddSingleton<IDbConfig>(sp => sp.GetRequiredService<IOptions<DbConfig>>().Value);

            services.AddTransient<IUserService, UserService>();

            services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

            services.AddCors();
            
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "JournalApp API",
                    Version = "v1",
                    Description = "Digital Journal App API"
                });
            });

            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_3_0);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            // app.UseHttpsRedirection();

            app.UseRouting();
            app.UseCors(builder => builder
                       .AllowAnyOrigin()
                       .AllowAnyMethod());
            app.UseAuthorization();

            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "JournalApp API V1");
            });

            app.UseEndpoints(endpoints => { endpoints.MapControllers(); });
        }
    }
}