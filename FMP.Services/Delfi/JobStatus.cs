using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace LasUploader.DelfiUploader
{
    public class JobStatus
    {
        public async Task<string> GetStatus(string jobId)
        {
            const string urlTemplate = "https://equipment-doms.endpoints.p4d-ddl-eu-services.cloud.goog/api/import/v1/equipmentactivity/:jobId/status";
            string url = urlTemplate.Replace(":jobId", jobId);

            string token = await DelfiKeys.Instance.GetBearerToken();

            using (HttpClient httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Add("slb-data-partition-id", "slb");
                httpClient.DefaultRequestHeaders.Add("AppKey", "CsdVK9L4NtBjWQCdJOFOFRR5czFDuTH7");
                httpClient.DefaultRequestHeaders.Add("Authorization", "Bearer " + token);

                var response = await httpClient.GetAsync(url);
                string content = await response.Content.ReadAsStringAsync();
                string formattedJson = JObject.Parse(content).ToString(Formatting.Indented);

                if (response.StatusCode == HttpStatusCode.NotFound)
                {
                    return "404: job not found. Please check few seconds later.";
                }

                if (response.IsSuccessStatusCode)
                {
                    return formattedJson;
                }

                throw new Exception("Error checking job status: " + formattedJson);
            }
        }
    }
}
