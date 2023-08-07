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
    public class HomeController : BaseController
    {
        public HomeController(IIdentityService identityService, IHttpClientFactory httpClientFactory) : base(identityService, httpClientFactory)
        { 
        }

        public IActionResult Index()
        {
            return View();
        }
    }
}
