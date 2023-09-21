using ImportKingMobile.Interfaces;
using ImportKingMobile.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
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
        public HomeController(IIdentityService identityService, IHttpClientFactory httpClientFactory, IOptions<AppSettings> appSettings) : base(identityService, httpClientFactory, appSettings)
        {
        }

        public IActionResult Index()
        {
            return View();
        }
    }
}
