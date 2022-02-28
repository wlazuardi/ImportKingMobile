using ImportKingMobile.Interfaces;
using ImportKingMobile.Models;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ImportKingMobile.Services
{
    public class IdentityService : IIdentityService
    {
        IHttpContextAccessor httpContext;

        public IdentityService(IHttpContextAccessor httpContext)
        {
            this.httpContext = httpContext;
        }

        public User GetCurrentUser()
        {
            if (httpContext.HttpContext.User.Claims.Count() == 0)
                return null;

            var email = httpContext.HttpContext.User.Claims.Where(x => x.Type == ClaimTypes.Email)
                .FirstOrDefault()
                .Value;

            var userType = httpContext.HttpContext.User.Claims.Where(x => x.Type == ClaimTypes.Role)
                .FirstOrDefault()
                .Value;

            var firstName = httpContext.HttpContext.User.Claims.Where(x => x.Type == ClaimTypes.GivenName)
                .FirstOrDefault()
                .Value;

            var lastName = httpContext.HttpContext.User.Claims.Where(x => x.Type == ClaimTypes.Surname)
                .FirstOrDefault()
                .Value;

            return new User()
            {
                FirstName = firstName,
                LastName = lastName,
                Email = email
            };
        }
    }
}
