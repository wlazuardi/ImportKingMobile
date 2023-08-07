using ImportKingMobile.Interfaces;
using ImportKingMobile.Models;
using ImportKingMobile.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Newtonsoft.Json;
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
        private readonly IIdentityService identityService;
        private readonly IHttpClientFactory httpClientFactory;

        public BaseController(IIdentityService identityService, IHttpClientFactory httpClientFactory)
        {
            this.identityService = identityService;
            this.httpClientFactory = httpClientFactory;
        }

        public async Task<bool> IsActiveEmployee(string emailAddress)
        {
            var url = string.Format("https://importking.mooo.com/api/Users/GetByEmail/{0}", emailAddress);
            var client = httpClientFactory.CreateClient();
            var result = await client.GetAsync(url);
            
            if (result.IsSuccessStatusCode)
            {
                var user = JsonConvert.DeserializeObject<User>(await result.Content.ReadAsStringAsync());
                if (user != null) 
                {
                    return true;
                }
            }

            return false;
        }

        public override async Task OnActionExecutionAsync(ActionExecutingContext filterContext, ActionExecutionDelegate next)
        {
            var user = identityService.GetCurrentUser();
            ViewBag.User = user;

            if (user != null && !await IsActiveEmployee(user.Email))
            {
                await HttpContext.SignOutAsync("cookie");
                filterContext.Result = new RedirectResult("https://importkingidentity.mooo.com/Account/Logout");
            }

            await base.OnActionExecutionAsync(filterContext, next);
        }
    }
}
