using ImportKingMobile.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ImportKingMobile.Controllers
{
    public class GenericController : BaseController
    {
        IIdentityService identityService;

        public GenericController(IIdentityService identityService) : base(identityService)
        {
            this.identityService = identityService;
        }

        public IActionResult ComingSoon()
        {
            return View();
        }
    }
}
