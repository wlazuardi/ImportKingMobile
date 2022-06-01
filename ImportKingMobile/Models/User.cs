using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ImportKingMobile.Models
{
    public class User
    {
        public int UserId { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Password { get; set; }
        public string PhotoUrl { get; set; }
        public string PhoneNumber { get; set; }
        public int UserType { get; set; }
        public string MerchantName { get; set; }
    }
}
