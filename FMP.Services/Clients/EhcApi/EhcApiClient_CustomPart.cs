using System;
using System.Net.Http;
using System.Threading.Tasks;
using IdentityModel.Client;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

namespace FMP.Service.Clients.EhcApi
{
    public partial class EhcApiClient
    {
        private string _token;
        private const string tokenUrl = "http://auth.dev.tlm.slb.com/connect/token";

        /// <inheritdoc />
        public EhcApiClient(IConfiguration configuration)
        {
            BaseUrl = configuration["EhcDemoApi:EhcApiUrl"]; 
            _httpClient = new HttpClient(); 
            _settings = new System.Lazy<Newtonsoft.Json.JsonSerializerSettings>(() => 
            {
                var settings = new Newtonsoft.Json.JsonSerializerSettings() {
                    Formatting = Formatting.Indented};
                UpdateJsonSerializerSettings(settings);
                return settings;
            });
        }

        partial void PrepareRequest(System.Net.Http.HttpClient client, System.Net.Http.HttpRequestMessage request,
            System.Text.StringBuilder urlBuilder)
        {
            EnsureToken().Wait();
        }

        async Task EnsureToken()
        {
            if (_token != null)
            {
                return;
            }

            _token = await RequestNewToken();
            _httpClient.SetBearerToken(_token);
        }

        private async Task<string> RequestNewToken()
        {
            HttpClientHandler handler = new HttpClientHandler();
            HttpClient httpClient = new HttpClient(handler);

            var response = await httpClient.RequestClientCredentialsTokenAsync(new ClientCredentialsTokenRequest
            {
                Address = tokenUrl,
                Scope = "ehcapi",
                ClientId = "ehc_client",
                ClientSecret = "ehC@C!ient"
            });

            if (response.IsError)
            {
                throw new Exception($"Error while requesting ECH.API token: { response.Error }");
            }

            return response.AccessToken;
        }
    }
}
