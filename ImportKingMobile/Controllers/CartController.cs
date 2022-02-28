using ImportKingMobile.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ImportKingMobile.Controllers
{
    public class CartController : BaseController
    {
        IIdentityService identityService;

        public CartController(IIdentityService identityService) : base(identityService)
        {
            this.identityService = identityService;
        }

        public IActionResult Index()
        {
            return View();
        }
    }
}
