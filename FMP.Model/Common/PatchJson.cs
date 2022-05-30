using System;
using System.Collections.Generic;
using System.Text;

namespace FMP.Model.Common
{
    /// <summary>
    /// Json Patch Model
    /// </summary>
    public class PatchJson
    {
        /// <summary>
        /// Operator for patch operation (Add/Remove...etc)
        /// </summary>
        public string op { get; set; }
        /// <summary>
        /// Source of the operation
        /// </summary>
        public string From { get; set; }
        /// <summary>
        /// Value to be updated
        /// </summary>
        public string value { get; set; }
        /// <summary>
        /// Field to be updated
        /// </summary>
        public string path { get; set; }
    }
}
