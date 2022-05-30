using System.Collections.Generic;
using System.Threading.Tasks;

namespace FMP.Service.Mateo.Interface
{
    public  interface ImateoService
    {
        Task<List<FMP.Model.MateoDataModel.Mateo>> GetmateoDataBySite(List<string> sites, string token);
    }
}
