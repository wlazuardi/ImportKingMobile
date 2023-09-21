using ImportKingMobile.Interfaces;
using ImportKingMobile.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace ImportKingMobile.Controllers
{
    public class CartController : BaseController
    {
        IIdentityService identityService;
        AppSettings appSettings;

        public CartController(IIdentityService identityService, IOptions<AppSettings> appSettings, IHttpClientFactory httpClientFactory) : base(identityService, httpClientFactory, appSettings)
        {
            this.identityService = identityService;
            this.appSettings = appSettings.Value;
        }

        public IActionResult Index()
        {
            return View();

            if (appSettings.DemoUsers.Count > 0 && appSettings.DemoUsers.Contains(ViewBag.User.Email))
            {
                return View();
            }
            else
            {
                return RedirectToAction("ComingSoon", "Generic");
            }
        }

        public IActionResult Pending()
        {
            if (ViewBag.User.UserType == 3)
            {
                return View();
            }
            else
            {
                return RedirectToAction("ComingSoon", "Generic");
            }
        }

        [Route("Cart/Pending/{email}/Detail")]
        public IActionResult PendingDetail(string email)
        {
            if (ViewBag.User.UserType == 3)
            {
                ViewBag.CartEmail = email;
                return View();
            }
            else
            {
                return RedirectToAction("ComingSoon", "Generic");
            }
        }
    }
}
