using Microsoft.AspNetCore.Mvc.Filters;
using System.Threading.Tasks;

namespace ImportKingMobile.Services
{
    public class DefaultAuthFilter : ActionFilterAttribute
    {
        public DefaultAuthFilter()
        { 

        }

        public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next) 
        {
            await base.OnActionExecutionAsync(context, next);
        }
    }
}
