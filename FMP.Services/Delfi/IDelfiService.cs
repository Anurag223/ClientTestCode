using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace FMP.Service.Delfi
{
    /// <summary>
    /// Service that exposes Delfi operations to the controllers.
    /// </summary>
    public interface IDelfiService
    {
        /// <summary>
        /// Handles the incoming file. Saves locally and then uploads
        /// </summary>
        /// <returns></returns>
        Task<string> UploadLasFile(IFormFile file);
        Task<string> GetJobStatus(string jobID);
    }
}