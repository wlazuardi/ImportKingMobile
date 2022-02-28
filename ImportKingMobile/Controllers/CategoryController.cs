using ImportKingMobile.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ImportKingMobile.Controllers
{
    public class CategoryController : BaseController
    {
        public CategoryController(IIdentityService identityService) : base(identityService)
        { 
        }

        public IActionResult Index()
        {
            return View();
        }
    }
}
