using ImportKingMobile.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http;

namespace ImportKingMobile.Controllers
{
    public class StockOutController : BaseController
    {
        public StockOutController(IIdentityService identityService, IHttpClientFactory httpClientFactory) : base(identityService, httpClientFactory)
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