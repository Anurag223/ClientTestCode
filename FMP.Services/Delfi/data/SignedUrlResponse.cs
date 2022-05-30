using Newtonsoft.Json;
using System;

namespace Slb.Ingestion.Pipeline.Service.DotNetClient.Data
{
    [Serializable]
    internal class SignedUrlResponse
    {
        [JsonProperty("responseCode")]
        public int ResponseCode { get; set; }
        [JsonProperty("locationUrl")]
        public string LocationUrl { get; set; }
        [JsonProperty("relativeFilePath")]
        public string RelativeFilePath { get; set; }
        [JsonProperty("errorMessage")]
        public string ErrorMessage { get; set; }
        [JsonProperty("errorContent")]
        public string ErrorContent { get; set; }
    }
}
