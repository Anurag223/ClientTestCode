using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Deedle;
using LasUploader;
using LasUploader.DelfiUploader;
using Microsoft.AspNetCore.Http;
using MoreLinq.Extensions;
using Newtonsoft.Json;
using Serilog;

namespace FMP.Service.Delfi
{
    /// <inheritdoc />
    public class DelfiService : IDelfiService
    {
        private readonly string stagingDirectory = Path.Combine("fileupload"); 


        /// <inheritdoc />
        public DelfiService()
        {

        }
        public async Task<string> GetJobStatus(string jobID)
        {
            string status = await new JobStatus().GetStatus(jobID);
            Console.WriteLine("JobId = " + status);
            return status;
        }
        /// <inheritdoc />
        public async Task<string> UploadLasFile(IFormFile file)
        {
            const string filePath = @"./PHM_WL_XLROCK_MSCT-F_534_2019.03.12-12.33.48_2019.03.12-12.40.50.LAS";
            string path = SaveFileToStaging(file);
            string jobId = await Uploader.SendFile(path);
            //string jobId = await Uploader.SendFileFromFile(file);
            Console.WriteLine("JobId = " + jobId);

           
            return jobId;
        }
        private string SaveFileToStaging(IFormFile file)
        {
            var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
            fileName = Path.GetFileName(fileName);

            var fullPath = Path.Combine(stagingDirectory, fileName);
            // creates the dir if it does not already exist
            Directory.CreateDirectory(stagingDirectory);
            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                file.CopyTo(stream);
            }

            return fullPath;
        }
    }
}
