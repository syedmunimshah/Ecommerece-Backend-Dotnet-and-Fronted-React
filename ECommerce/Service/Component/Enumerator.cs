using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Component
{
    public enum Roles
    {
        Admin = 1,
        User = 2,
        Seller = 3
    }

    public enum SellerStatus
    {

        Pending = 0,
        Approved = 1,
        Rejected = 2
    }
}
