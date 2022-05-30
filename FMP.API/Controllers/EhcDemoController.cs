using System;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using FMP.API.Infrastructure.Exceptions;
using FMP.Service.Delfi;
using FMP.Service.Ehc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace FMP.API.Controllers
{
    [Authorize]
    [ApiVersion("1.0")]
    [Produces("application/json")]
    [ApiExplorerSettings(GroupName = "v1")]
    public class EhcDemoController : Controller
    {
        private readonly IEhcDataService _ehcDataService;
        private readonly IDelfiService _delfiService;

        /// <summary>
        /// Creates an instance of the <see cref="EhcDemoController"/>.
        /// </summary>
        public EhcDemoController(IEhcDataService ehcDataService,
                                 IDelfiService delfiService)
        {
            _ehcDataService = ehcDataService;
            _delfiService = delfiService;
        }

        [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [HttpPost]
        [Route("api/EhcData/ProcessEmotEpisode")]
        public async Task<IActionResult> GetUserProfile(string episodeId, string wkeId, string correlationId)
        {
            try
            {
                var result = await _ehcDataService.CreateChildEpisodesAndEpisodicPoints(episodeId, wkeId, correlationId);
                if (result != null)
                    return Ok(result);
                return NotFound();

            }
            catch (Exception ex)
            {
                throw new DomainException(ex.Message, ex);
            }
        }
        /// <summary>
        ///     Upload a file of Las format.
        /// </summary>
        /// <param name="myFile">the local zip file to upload</param>
        /// <returns>the success message with sample of the json representation string (tempory).</returns>
        /// <response code="200"> processing notes and the xml converted to a json string</response>
        /// <response code="400"> bad filename... must end with .zip</response>
        /// <response code="500"> Oops! Can't getprocess this file</response>
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [HttpPost]
        [DisableRequestSizeLimit]
        [Route("api/EhcData/UploadLasFile")]
        public async Task<IActionResult> Upload(IFormFile myFile)
        {
            try
            {
                var file = Request.Form.Files[0];
                var result = await _delfiService.UploadLasFile(file);
                if (result != null)
                    return Ok(result);
                return NotFound();

            }
            catch (Exception ex)
            {
                throw new DomainException(ex.Message, ex);
            }
        }
        /// <summary>
        ///     Get a Job status from Delfi
        /// </summary>
        /// <param name="jobID">the id of the job (from Upload process)</param>
        /// <returns>the  message with sample of the json representation string (tempory).</returns>
        /// <response code="200"> processing notes and the xml converted to a json string</response>
        /// <response code="500"> Oops! Can't getprocess this file</response>
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [HttpGet]
        [Route("api/EhcData/JobStatus")]
        public async Task<IActionResult> GetJobStatus(string jobID)
        {
            try
            {

                var result = await _delfiService.GetJobStatus(jobID);
                if (result != null)
                    return Content(result, "application/json");
                return NotFound();

            }
            catch (Exception ex)
            {
                throw new DomainException(ex.Message, ex);
            }
        }
        /// <summary>
        ///     Get a Job status from ODM
        /// </summary>
        /// <param name="correlationId">the id of the job (from Upload process)</param>
        /// <returns>the  message with sample of the json representation string (tempory).</returns>
        /// <response code="200"> processing notes and the xml converted to a json string</response>
        /// <response code="500"> Oops! Can't getprocess this file</response>
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [HttpGet]
        [Route("api/EhcData/ODMStatus")]
        public async Task<IActionResult> GetODMStatus(string correlationId)
        {
            try
            {

                var result = await _ehcDataService.getODMStatus(correlationId);
                if (result != null)
                    return Content(result, "application/json");
                return NotFound();

            }
            catch (Exception ex)
            {
                throw new DomainException(ex.Message, ex);
            }
        }

    }
}
