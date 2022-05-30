using System.Net.Http;
using System.Threading.Tasks;

namespace FMP.Service.Ehc
{
    /// <summary>
    /// Service that exposes EHC operations to the controllers.
    /// </summary>
    public interface IEhcDataService
    {
        /// <summary>
        /// Creates core episodes based on existing episode of data.
        /// </summary>
        /// <returns></returns>
        Task<string> CreateChildEpisodesAndEpisodicPoints(string episodeId, string wkeId, string correlationId);
        /// <summary>
        /// Get the status from ODM
        /// </summary>
        /// <param name="correlationId"></param>
        /// <returns></returns>
        Task<string> getODMStatus(string correlationId);
    }
}