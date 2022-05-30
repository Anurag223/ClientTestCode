using System;
using System.Collections.Generic;
using System.Text;

namespace FMP.Model.MateoDataModel
{
   public class MateoResponseDataModel
    {
        public string id { get; set; }
        public string createdDate { get; set; }
        public string createdBy { get; set; }
        public string modifiedDate { get; set; }
        public string modifiedBy { get; set; }
        public string activeCmms { get; set; }
        public string sourceSystemRecordId { get; set; }
        public string controlSiteCode { get; set; }
        public string equipmentCode { get; set; }
        public EquipmentCodeClassification equipmentCodeClassification { get; set; }
        public string equipmentState { get; set; }
        public string manufacturer { get; set; }
        public string manufacturedDate { get; set; }
        public string owner { get; set; }
        public string ownerSiteCode { get; set; }
        public string serialNumber { get; set; }
        public List<Workorder> workorders { get; set; }
    }

    public class Workorder
    {
        public string id { get; set; }
        public string createdDate { get; set; }
        public string createdBy { get; set; }
        public string modifiedDate { get; set; }
        public string modifiedBy { get; set; }
        public string description { get; set; }
        public string maintenanceActivitySubType { get; set; }
        public string plannedEndDate { get; set; }
        public string repairSiteCode { get; set; }
        public string statusChangeDate { get; set; }
        public string workorderNumber { get; set; }
        public string workorderStatusValue { get; set; }
    }

    public class EquipmentCodeClassification
    {
        public string groupCode { get; set; }
        public string productLineCode { get; set; }
        public string subProductLineCode { get; set; }
        public string productFamilyCode { get; set; }
        public string emsProductLineCode { get; set; }
        public string brandCode { get; set; }
        public string equipmentCode { get; set; }
        public string name { get; set; }
    }

    public class MateoDataResponse
    {
        public List<MateoResponseDataModel> mateoResponseDataModel { get; set; }
        public int totalcount { get; set; }
    }
   public class ItemEqualityComparer : IEqualityComparer<MateoResponseDataModel>
    {
        public bool Equals(MateoResponseDataModel x, MateoResponseDataModel y)
        {
            // Two items are equal if their keys are equal.
            return x.id == y.id;
        }

        public int GetHashCode(MateoResponseDataModel obj)
        {
            return obj.id.GetHashCode();
        }
    }
}
