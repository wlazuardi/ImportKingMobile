using System.Collections.Generic;

namespace ImportKingMobile.Models
{
    public class AppSettings
    {
        public List<string> DemoUsers { get; set; }
        public string HostUrl { get; set; }
        public string IdentityHostUrl { get; set; }
    }
}
