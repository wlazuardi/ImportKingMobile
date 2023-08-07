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
    public class CategoryController : BaseController
    {
        public CategoryController(IIdentityService identityService, IHttpClientFactory httpClientFactory) : base(identityService, httpClientFactory)
        { 
        }

        public IActionResult Index()
        {
            return View();
        }
    }
}
