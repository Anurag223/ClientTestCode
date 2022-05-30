using System;
using System.Collections.Generic;
using System.Text;

namespace FMP.Model.MateoDataModel
{
   public class Mateo
    {

        public string Equipment_Code { get; set; }
        public string Serial_Number { get; set; }
        public string Installed_EN { get; set; }
        public string Installed_TR { get; set; }
        public string Installed_PE { get; set; }
        public string Installed_FE { get; set; }
        public string Asset_Location { get; set; }
        public int Engine_cost { get; set; }
        public int Transmission_cost { get; set; }
        public int Power_End_cost { get; set; }
        public int Fluid_End_cost { get; set; }
        public int Radiator_costs { get; set; }
        public string WO_Duration { get; set; }
        public long EstimatedCost { get; set; }
        public string WO_Number { get; set; }
        public string WO_Type { get; set; }
        public string WO_Status { get; set; }
        public string WO_Priority { get; set; }
        public string RepairSiteCode { get; set; }
        public string ownerSiteCode { get; set; }
    }
}
