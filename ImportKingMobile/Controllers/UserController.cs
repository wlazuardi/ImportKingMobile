using ImportKingMobile.Interfaces;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ImportKingMobile.Controllers
{
    public class UserController : BaseController
    {
        IIdentityService identityService;

        public UserController(IIdentityService identityService) : base(identityService)
        {
            this.identityService = identityService;
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

        [Authorize]
        public IActionResult Profile()
        {
            return View();
        }

        [Authorize]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync("cookie");
            return Redirect("https://importkingidentity.mooo.com/Account/Logout");
        }
    }
}
