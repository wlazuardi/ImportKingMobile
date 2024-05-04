using ImportKingMobile.Interfaces;
using ImportKingMobile.Models;
using ImportKingMobile.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace ImportKingMobile.Controllers
{
    [Authorize]
    [DefaultAuthFilter]
    public class BaseController : Controller
    {
        IHttpContextAccessor httpContext;
        private readonly IIdentityService identityService;
        private readonly IHttpClientFactory httpClientFactory;
        private AppSettings appSettings { get; set; }

        public BaseController(IIdentityService identityService, IHttpClientFactory httpClientFactory, IOptions<AppSettings> appSettings)
        {
            this.identityService = identityService;
            this.httpClientFactory = httpClientFactory;
            this.appSettings = appSettings.Value;
        }

        public async Task<User> GetEmployee(string emailAddress)
        {
            var url = string.Format($"{appSettings.HostUrl}/api/Users/GetByEmail/{emailAddress}");
            var client = httpClientFactory.CreateClient();
            var result = await client.GetAsync(url);

            if (result.IsSuccessStatusCode)
            {
                var user = JsonConvert.DeserializeObject<User>(await result.Content.ReadAsStringAsync());
                if (user != null)
                {
                    return user;
                }
            }

            return null;
        }

        public override async Task OnActionExecutionAsync(ActionExecutingContext filterContext, ActionExecutionDelegate next)
        {
            var user = identityService.GetCurrentUser();
            ViewBag.User = user;
            ViewBag.HostUrl = appSettings.HostUrl;

            bool isAnonymous = filterContext.ActionDescriptor.EndpointMetadata.Any(x => x.GetType() == typeof(AllowAnonymousAttribute));

            if (!isAnonymous)
            {
                User userData = (user != null) ? await GetEmployee(user.Email) : null;

                if (userData == null)
                {
                    await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
                    filterContext.Result = new RedirectResult($"{appSettings.IdentityHostUrl}/Account/Logout");
                }
                else if (userData.Status == Constants.UserStatus.Inactive)
                {
                    filterContext.Result = new RedirectToActionResult("InactiveUser", "Notification", null);
                }

                var customToken = HttpContext.User.Claims.Where(x => x.Type == "CustomToken").FirstOrDefault();
                ViewBag.CustomToken = customToken.Value;
            }

            await base.OnActionExecutionAsync(filterContext, next);
        }
    }
}
