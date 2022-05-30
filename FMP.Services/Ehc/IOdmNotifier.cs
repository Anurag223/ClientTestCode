using System.Net.Http;
using System.Threading.Tasks;

namespace FMP.Service.Ehc
{
    /// <summary>
    /// The ODM notifier.
    /// </summary>
    public interface IOdmNotifier
    {
        /// <summary>
        /// Notifies the ODM that the episodic points for eMOT have been saved already.
        /// </summary>
        /// <param name="wkeId">The well-know entity ID of the equipment.</param>
        /// <param name="correlationId">The correltionID relate to the workflow</param>
        Task NotifyOdm(string wkeId, string correlationId);

        /// <summary>
        /// Retrieves status from ODM using correlation ID
        /// </summary>
        /// <param name="correlationId">The correltionID relate to the workflow</param>
        Task<string> GetODMStatus(string correlationId);
    }
}