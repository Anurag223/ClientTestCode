using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Slb.Ingestion.Pipeline.Service.DotNetClient;

namespace LasUploader
{
    static class Uploader
    {
        public static async Task<string> SendFile(string filePath)
        {
            const string endPoint = "https://api.evq.csp.slb.com/de/ingestion/v1/submit";

            //string kind = "slb:maxwell:manual_upload:1.0.0";
            string kind = "slb:maxwell-phm-test:file:1.0.0";

            string acl = "{\"acl\":{\"owners\":[\"data.default.owners@slb.p4d.cloud.slb-ds.com\"],\"viewers\":[\"data.default.viewers@slb.p4d.cloud.slb-ds.com\"]}}";
            string legaltags = "{\"legal\":{\"legaltags\":[\"slb-default-legal\"],\"otherRelevantDataCountries\":[\"US\"]}}";

            string ingestorRoutines = null;

            string slbAccountId = "slb";
            string slbOnBehalfOf = null;
            string appKey = "gBEG7xMgOTdyYtoNBcRCv8GhYp6WrhVZ";

            string additionalProperties = "{\"userEmailAddress\":\"useremail@slb.com\", \"serviceName\": \"Maxwell\", \"contentType\": \"\"}";

            IngestionConfig config = new IngestionConfig(slbAccountId, InputType.clientLib, kind, acl, legaltags, ingestorRoutines, null, slbOnBehalfOf, appKey);
            IngestionClientService ingestionClientService = new IngestionClientService(config, filePath, endPoint, additionalProperties);

            return await ingestionClientService.Submit();
        }
        public static async Task<string> SendFileFromFile(IFormFile file)
        {
            const string endPoint = "https://api.evq.csp.slb.com/de/ingestion/v1/submit";

            string kind = "slb:maxwell:manual_upload:1.0.0";

            string acl = "{\"acl\":{\"owners\":[\"data.default.owners@slb.p4d.cloud.slb-ds.com\"],\"viewers\":[\"data.default.viewers@slb.p4d.cloud.slb-ds.com\"]}}";
            string legaltags = "{\"legal\":{\"legaltags\":[\"slb-default-legal\"],\"otherRelevantDataCountries\":[\"US\"]}}";

            string ingestorRoutines = null;

            string slbAccountId = "slb";
            string slbOnBehalfOf = null;
            string appKey = "gBEG7xMgOTdyYtoNBcRCv8GhYp6WrhVZ";

            string additionalProperties = "{\"userEmailAddress\":\"useremail@slb.com\", \"serviceName\": \"Maxwell\", \"contentType\": \"\"}";

            IngestionConfig config = new IngestionConfig(slbAccountId, InputType.clientLib, kind, acl, legaltags, ingestorRoutines, null, slbOnBehalfOf, appKey);
            IngestionClientService ingestionClientService = new IngestionClientService(config, file, endPoint, additionalProperties);

            return await ingestionClientService.Submit();
        }
    }
}
