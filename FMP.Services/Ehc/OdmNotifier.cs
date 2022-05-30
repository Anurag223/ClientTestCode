using System;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Serilog;

namespace FMP.Service.Ehc
{
    /// <inheritdoc />
    public class OdmNotifier : IOdmNotifier
    {
        private readonly HttpClient _client;

        /// <summary>
        /// Creates an instance of <see cref="OdmNotifier"/>
        /// </summary>
        /// <param name="configuration"></param>
        public OdmNotifier(IConfiguration configuration)
        {
            //_client = new HttpClient { BaseAddress = new Uri(configuration["EhcDemoApi:OdmEndpointUrl"], UriKind.Absolute) };
            _client = new HttpClient { BaseAddress = new Uri(configuration["EhcDemoApi:OdmEndpointUrl"], UriKind.Absolute) };
            _client.DefaultRequestHeaders.Add("x-apikey", configuration["EhcDemoApi:OdmEndpointToken"]);
        }

        /// <inheritdoc />
        public async Task NotifyOdm(string wkeId, string correlationId)
        {
            var request = new { wkeid = wkeId, slbCorrelationId = correlationId };
            var requestString = JsonConvert.SerializeObject(request);
            Log.Information("Calling ODM via this URL: {URL}", _client.BaseAddress+ "equipment-event/");
            var requestMessage = new HttpRequestMessage(HttpMethod.Post, _client.BaseAddress + "equipment-event/");
            requestMessage.Content = new StringContent(requestString, Encoding.UTF8, "application/json");
            var response = await _client.SendAsync(requestMessage);
            Log.Information("Received a response from the ODM: {response}", response);
        }
        /// <summary>
        /// Retrieves status from ODM using correlation ID
        /// </summary>
        /// <param name="correlationId">The correltionID relate to the workflow</param>
        public async Task<string> GetODMStatus(string correlationId)
        {
            string url = _client.BaseAddress + "status/" + correlationId;
            Log.Information("Calling ODM via this URL: {URL}", url);

            

            using (HttpClient httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Add("x-apikey", "BRyM2hGAMKPEHHtEgrAGEVnutNTyxpBR");

                var response = await httpClient.GetAsync(url);
                string content = await response.Content.ReadAsStringAsync();
                string formattedJson = Newtonsoft.Json.Linq.JObject.Parse(content).ToString(Formatting.Indented);

                if (response.StatusCode == HttpStatusCode.NotFound)
                {
                    return "404: job not found. Please check few seconds later.";
                }

                if (response.IsSuccessStatusCode)
                {
                    return formattedJson;
                }

                throw new Exception("Error checking odm status: " + formattedJson);
            }
        }
    }
}