using FMP.Model.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace FMP.Model.RoleDataModel
{
    public class RoleRequest : BaseDataModel
    {
        /// <summary>
        /// Primary key for Role
        /// </summary>
        public int ID { get; set; }

        /// <summary>
        /// Role Name
        /// </summary>
        public string Name { get; set; }
        
        /// <summary>
        /// Role Description
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// Mapped Claims for the FMP Role
        /// </summary>
        public List<int> MappedClaims { get; set; }

        /// <summary>
        /// Mapped CMMS roles for the FMP role
        /// </summary>
        public List<int> MappedCMMSRoles { get; set; }
    }
}
