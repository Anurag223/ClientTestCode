using FMP.Model.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace FMP.Model.LayoutDataModel
{
    /// <summary>
    /// Favorite layout patch request model
    /// </summary>
    public class FavoriteLayoutRequest
    {
        public string ldap { get; set; }

        public string applicationName { get; set; }

        public PatchJson patchJson { get; set; }
    }

}
