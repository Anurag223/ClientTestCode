using System;

namespace FMP.Repository
{
    public static class PredicateBuilder
    {
       

        internal static object ValidDate(string datetimeString)
        {
            DateTime tempDate;
            bool validDate =  DateTime.TryParse(datetimeString,out tempDate);
            if (validDate)
            {
                return tempDate;
            }
            else { return null; }
        }

    }
}
