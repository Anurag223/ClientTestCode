using ingestion_pipeline_dotnet_client;
using Newtonsoft.Json;
using Slb.Ingestion.Pipeline.Service.DotNetClient.Data;
using System;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace Slb.Ingestion.Pipeline.Service.DotNetClient
{
    public class IngestionPipelineService
    {
        public async Task<string> Invoke(string requestUri, UploadRequest uploadRequest, string authorization, string slbDataPartitionId, string slbOnBehalfOf, string appKey)
        {
            Console.WriteLine("Calling Ingestion API");

            using (HttpClient httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue(Constants.Bearer, authorization);
                httpClient.DefaultRequestHeaders.Add(Constants.slbDataPartitionId, slbDataPartitionId);
                httpClient.DefaultRequestHeaders.Add(Constants.SlbOnBehalfOf, slbOnBehalfOf);
                httpClient.DefaultRequestHeaders.Add(Constants.AppKey, appKey);

                HttpContent httpContent = GetHttpContent(uploadRequest);
                HttpResponseMessage response = await httpClient.PostAsync(requestUri, httpContent).ConfigureAwait(false);
                string content = await response.Content.ReadAsStringAsync().ConfigureAwait(false);

                if (response.StatusCode.Equals(HttpStatusCode.OK))
                {
                    UploadResponse obj = JsonConvert.DeserializeObject<UploadResponse>(content);
                    return obj.JobId;
                }

                throw new Exception("Error calling Ingestion API: " + response.ReasonPhrase + ". " + content);
                
            }
        }

        private HttpContent GetHttpContent(UploadRequest uploadRequest)
        {
            string jsonInString = JsonConvert.SerializeObject(uploadRequest, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore });
            return new StringContent(jsonInString, Encoding.UTF8, Constants.MediaType);
        }
    }
}
