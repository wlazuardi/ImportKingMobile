using ImportKingMobile.Interfaces;
using ImportKingMobile.Models;
using ImportKingMobile.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Logging;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ImportKingMobile
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
            ServicePointManager.Expect100Continue = true;
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls
            | SecurityProtocolType.Tls11
            | SecurityProtocolType.Tls12;
            IdentityModelEventSource.ShowPII = true;

            services.AddAuthentication(options =>
            {
                options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = OpenIdConnectDefaults.AuthenticationScheme;
            })
            .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, options => {
                string dataProtectionDir = Configuration.GetValue<string>("DataProtectionDir");
                options.Cookie.Name = "ImportKingCookie";
                options.Cookie.SameSite = SameSiteMode.None;
                options.DataProtectionProvider = DataProtectionProvider.Create(new DirectoryInfo(dataProtectionDir));
            })
            .AddOpenIdConnect(OpenIdConnectDefaults.AuthenticationScheme, options =>
            {
                options.Authority = "https://importkingidentity.mooo.com";                
                options.ClientId = "oidcMVCApp";
                options.ClientSecret = "ProCodeGuide";
                options.ResponseType = OpenIdConnectResponseType.Code;
                options.ResponseMode = OpenIdConnectResponseMode.Query;
                options.UsePkce = true;
                options.Scope.Add("userApi.profile.read");
                options.SaveTokens = true;

                options.NonceCookie.SameSite = SameSiteMode.None;
                options.CorrelationCookie.SameSite = SameSiteMode.None;

                options.ClaimActions.MapJsonKey(ClaimTypes.Email, "email");
                options.ClaimActions.MapJsonKey(ClaimTypes.Role, "role");
                options.ClaimActions.MapJsonKey(ClaimTypes.GivenName, "givenName");
                options.ClaimActions.MapJsonKey(ClaimTypes.Surname, "surName");

                options.Events = new OpenIdConnectEvents
                {
                    OnTokenValidated = context =>
                    {
                        // Here you can access the JWT token in context.SecurityToken
                        if (context.SecurityToken is JwtSecurityToken jwtToken)
                        {
                            // Access the JWT token and its claims
                            string accessToken = jwtToken.RawData; // The raw JWT token as a string
                            string subjectClaim = jwtToken.Subject; // The subject claim (usually the user's unique identifier)

                            // You can also access other claims as needed
                            var nameClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "name")?.Value;
                            var roleClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "role")?.Value;

                            // Use the JWT token and claims as needed in your application
                            // For example, you can store them in a user's session or claims principal.
                            var customTokenClaim = new Claim("CustomToken", accessToken);
                            context.Principal.AddIdentity(new ClaimsIdentity(
                                new[]
                                {
                                    customTokenClaim
                                }
                            ));
                        }

                        return Task.CompletedTask;
                    },
                    OnTokenResponseReceived = context => 
                    {
                        return Task.CompletedTask;
                    }
                };
            });

            services.AddScoped<IIdentityService, IdentityService>();
            services.AddHttpContextAccessor();
            services.AddHttpClient();
            services.AddControllersWithViews().AddRazorRuntimeCompilation();
            services.Configure<AppSettings>(Configuration.GetSection("AppSettings"));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                app.UseHsts();
            }

            app.UseHttpsRedirection();

            var provider = new FileExtensionContentTypeProvider();
            provider.Mappings[".mjs"] = "text/javascript";
            app.UseStaticFiles(
                new StaticFileOptions() 
                { 
                    ContentTypeProvider = provider
                }
            );

            app.UseRouting();

            app.UseCors(builder => builder
                .WithOrigins(
                    "https://importking.mooo.com",
                    "https://importkingmobile.mooo.com",
                    "https://localhost:44327"
                )
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials()
            );

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseCookiePolicy(new CookiePolicyOptions
            {

                MinimumSameSitePolicy = SameSiteMode.None,
                Secure = CookieSecurePolicy.Always,
                HttpOnly = Microsoft.AspNetCore.CookiePolicy.HttpOnlyPolicy.Always
            });

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");
            });
        }
    }
}
