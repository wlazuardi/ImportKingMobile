using ImportKingMobile.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace ImportKingMobile.Controllers
{
    [AllowAnonymous]
    public class HomeController : Controller
    {
        public HomeController(IIdentityService identityService, IHttpClientFactory httpClientFactory)
        { 
        }

        public IActionResult Index()
        {
            return View();
        }
    }
}
