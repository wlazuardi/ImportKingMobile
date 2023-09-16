using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace ImportKingMobile.Controllers
{
    [Route("/SignInOpenIdConnect")]    
    public class SignInController : ControllerBase
    {
        public async Task<IActionResult> SignInOidc() 
        {
            var authenticateResult = await HttpContext.AuthenticateAsync(OpenIdConnectDefaults.AuthenticationScheme);

            if (authenticateResult.Succeeded)
            {
                // Authentication successful, you can access user information
                var accessToken = authenticateResult.Properties.GetTokenValue("access_token");
                // Use the access token to make API requests to Site B
                // Redirect or perform other actions as needed
            }
            else
            {
                // Handle authentication failure
            }

            // Redirect to the desired page
            return RedirectToAction("Index");
        }
    }
}
