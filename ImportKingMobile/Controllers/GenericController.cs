using ImportKingMobile.Interfaces;
using ImportKingMobile.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.Net.Http;

namespace ImportKingMobile.Controllers
{
    public class GenericController : BaseController
    {
        private readonly IIdentityService identityService;
        private readonly IHttpClientFactory httpClientFactory;

        public GenericController(IIdentityService identityService, IHttpClientFactory httpClientFactory, IOptions<AppSettings> appSettings) : base(identityService, httpClientFactory, appSettings)
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
