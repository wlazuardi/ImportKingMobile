using ImportKingMobile.Interfaces;
using ImportKingMobile.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace ImportKingMobile.Controllers
{
    public class UserController : BaseController
    {
        IIdentityService identityService;
        AppSettings appSettings { get; set; }

        public UserController(IIdentityService identityService, IHttpClientFactory httpClientFactory, IOptions<AppSettings> appSettings) : base(identityService, httpClientFactory, appSettings)
        {
            this.identityService = identityService;
            this.appSettings = appSettings.Value;
        }

        [AllowAnonymous]
        public IActionResult SignUp()
        {
            if (identityService.GetCurrentUser() != null) 
            {
               return RedirectToAction("Index", "Home", null);
            }

            return View();
        }

        [AllowAnonymous]
        public IActionResult DeleteAccount()
        {
            if (identityService.GetCurrentUser() != null)
            {
                return RedirectToAction("Index", "Home", null);
            }

            return View();
        }

        [Authorize]
        public IActionResult Profile()
        {
            return View();
        }

        [Authorize]
        public IActionResult Address()
        {
            return View();
        }

        [Authorize]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Redirect($"{appSettings.IdentityHostUrl}/Account/Logout");
        }
    }
}
