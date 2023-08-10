using Microsoft.AspNetCore.Mvc;

namespace ImportKingMobile.Controllers
{
    public class NotificationController : Controller
    {
        public IActionResult InactiveUser()
        {
            return View();
        }
    }
}
