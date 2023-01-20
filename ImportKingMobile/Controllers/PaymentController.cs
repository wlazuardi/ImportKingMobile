using Microsoft.AspNetCore.Mvc;

namespace ImportKingMobile.Controllers
{
    public class PaymentController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Success(string order_id, string result)
        {
            int orderId = 0;
            if (!string.IsNullOrEmpty(order_id))
            {
                var parts = order_id.Split("-");
                if (parts.Length > 0)
                {
                    int.TryParse(parts[parts.Length - 1], out orderId);
                }
            }

            ViewBag.OrderId = orderId;
            ViewBag.OrderNo = order_id;
            ViewBag.Result = result;
            return View();
        }
    }
}
