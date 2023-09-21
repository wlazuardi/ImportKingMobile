using ImportKingMobile.Interfaces;
using ImportKingMobile.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.Net.Http;

namespace ImportKingMobile.Controllers
{
    public class StockOutController : BaseController
    {
        public StockOutController(IIdentityService identityService, IHttpClientFactory httpClientFactory, IOptions<AppSettings> appSettings) : base(identityService, httpClientFactory, appSettings)
        { 
        }

        public IActionResult Index()
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
    }
}