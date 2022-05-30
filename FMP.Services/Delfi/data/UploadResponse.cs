using Newtonsoft.Json;
using System;

namespace Slb.Ingestion.Pipeline.Service.DotNetClient.Data
{
    [Serializable]
    class UploadResponse
    {
        [JsonProperty("jobId")]
        public string JobId { get; set; }
        [JsonProperty("code")]
        public int Code { get; set; }
    }
}
