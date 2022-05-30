using Newtonsoft.Json;
using System;

namespace Slb.Ingestion.Pipeline.Service.DotNetClient.Data
{
    [Serializable]
    public class UploadRequest
    {
        public UploadRequest(byte[] fileData, string fileName, string filePath, string fileInput, string kind, string acl,
                string legaltags, string ingestorRoutines, string enrichmentRoutines, string additionalProperties)
        {
            FileData = fileData;
            FileName = fileName;
            FilePath = filePath;
            FileInput = fileInput;
            Kind = kind;
            Acl = acl;
            Legaltags = legaltags;
            IngestorRoutines = ingestorRoutines;
            AdditionalProperties = additionalProperties;
            EnrichmentRoutines = enrichmentRoutines;
        }

        [JsonProperty("fileData")]
        public byte[] FileData { get; set; }
        [JsonProperty("fileName")]
        public string FileName { get; set; }
        [JsonProperty("filePath")]
        public string FilePath { get; set; }
        [JsonProperty("fileInput")]
        public string FileInput { get; set; }
        [JsonProperty("kind")]
        public string Kind { get; set; }
        [JsonProperty("acl")]
        public string Acl { get; set; }
        [JsonProperty("legaltags")]
        public string Legaltags { get; set; }
        [JsonProperty("ingestorRoutines")]
        public string IngestorRoutines { get; set; }
        [JsonProperty("enrichmentRoutines")]
        public string EnrichmentRoutines { get; set; }
        [JsonProperty("additionalProperties")]
        public string AdditionalProperties { get; set; }
    }
}
