using ImportKingMobile.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http;

namespace ImportKingMobile.Controllers
{
    public class GenericController : BaseController
    {
        private readonly IIdentityService identityService;
        private readonly IHttpClientFactory httpClientFactory;

        public GenericController(IIdentityService identityService, IHttpClientFactory httpClientFactory) : base(identityService, httpClientFactory)
        {
            this.identityService = identityService;
            this.httpClientFactory = httpClientFactory;
        }

        public IActionResult ComingSoon()
        {
            return View();
        }
    }
}
