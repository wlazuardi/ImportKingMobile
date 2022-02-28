using ImportKingMobile.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ImportKingMobile.Controllers
{
    [Authorize]
    public class BaseController : Controller
    {
        IIdentityService identityService;

        public BaseController(IIdentityService identityService)
        {
            this.identityService = identityService;
        }

        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            var user = identityService.GetCurrentUser();
            ViewBag.User = user;

            base.OnActionExecuting(filterContext);
        }
    }
}
