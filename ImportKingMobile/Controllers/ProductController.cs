using ImportKingMobile.Interfaces;
using ImportKingMobile.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ImportKingMobile.Controllers
{
    public class ProductController : BaseController
    {
        AppSettings appSettings;

        public ProductController(IIdentityService identityService, IOptions<AppSettings> appSettings) : base(identityService)
        {
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

        [Route("Product/{categoryId}/Detail")]
        public IActionResult Detail(int categoryId)
        {
            ViewBag.CategoryId = categoryId;
            return View();
        }
    }
}
