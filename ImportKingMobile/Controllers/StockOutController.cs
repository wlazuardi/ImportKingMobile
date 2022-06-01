using ImportKingMobile.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ImportKingMobile.Controllers
{
    public class StockOutController : BaseController
    {
        public StockOutController(IIdentityService identityService) : base(identityService)
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