using Microsoft.AspNetCore.Mvc;
using System.Linq;

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
            string orderNo = string.Empty;

            if (!string.IsNullOrEmpty(order_id))
            {
                var parts = order_id.Split("-");
                if (parts.Length > 0)
                {
                    int.TryParse(parts[4], out orderId);
                }

                if (parts.Length >= 5)
                {
                    parts = parts.Where((val, idx) => idx != 5).ToArray();
                    orderNo = string.Join("-", parts);
                }
            }

            ViewBag.OrderId = orderId;
            ViewBag.OrderNo = orderNo;
            ViewBag.Result = result;
            return View();
        }
    }
}
