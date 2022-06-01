using ImportKingMobile.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ImportKingMobile.Controllers
{
    public class OrderController : BaseController
    {
        IIdentityService identityService;

        public OrderController(IIdentityService identityService) : base (identityService)
        {
            this.identityService = identityService;
        }

        public IActionResult Index()
        {
            //if (ViewBag.User.UserType == 3)
            //{
                return View();
            //}
            //else
            //{
            //    return RedirectToAction("ComingSoon", "Generic");
            //}
        }
    }
}
