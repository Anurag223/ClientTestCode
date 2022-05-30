using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace LasUploader.DelfiUploader
{
    public class DelfiKeys
    {
        public static DelfiKeys Instance { get; } = new DelfiKeys();


        private readonly HttpClient _httpClient;
        private string _token;
        private DateTime _tokenTime;

        private DelfiKeys()
        {
            _httpClient = new HttpClient(new HttpClientHandler());
        }


        public async Task<string> GetBearerToken()
        {
            if (_token != null && DateTime.Now.Subtract(_tokenTime).TotalHours < 1)
            {
                return _token;
            }

            _token = await RequestNewToken();
            _tokenTime = DateTime.Now;

            return _token;
        }

 

        private async Task<string> RequestNewToken()
        {
            const string url = "https://tksvc-dot-cfsauth-preview.appspot.com/v1/svctk?key=AIzaSyDkZlfehVTPtigUJMvZwecEgRc14Wd8X18";

            string json = JsonConvert.SerializeObject(new
            {
                projectid = "dtwdev.slbapp.com",
                serviceid = "equipmenthistorian-p4d-dtwdev.slbservice.com",
                secret = "f3b3108182704e8796ccad2ecaeb6aad46060f349b746",
                targetprojid = "datalake.slbapp.com",
                targetserviceid = "services-datalake.slbservice.com"
            });

            var content = new StringContent(json);
            content.Headers.ContentType = MediaTypeHeaderValue.Parse("application/json");

            var response = await _httpClient.PostAsync(url, content);
            string text = await response.Content.ReadAsStringAsync();

            if (response.IsSuccessStatusCode)
            {
                string token = JObject.Parse(text)["svctoken"].Value<string>();
                return token;
            }

            throw new Exception("Error getting bearer token: " + response.ReasonPhrase + " " + text);
        }

    }
}
