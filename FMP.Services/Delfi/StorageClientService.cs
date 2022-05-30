
using Google.Apis.Upload;
using Google.Cloud.Storage.V1;
using ingestion_pipeline_dotnet_client;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Slb.Ingestion.Pipeline.Service.DotNetClient.Data;
using System;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;

namespace Slb.Ingestion.Pipeline.Service.DotNetClient
{
    public class StorageClientService
    {
        private static void Upload_ProgressChanged(IUploadProgress progress)
        {
            Console.WriteLine($" {DateTime.UtcNow.ToString()} : MB : {progress.BytesSent / 1024 / 1024}, status: {progress.Status}");
        }
        private static async Task<IUploadProgress> UploadStreamResumableAsyncFromFile(IFormFile file, string url)
        {
            using (FileStream stream = (FileStream)file.OpenReadStream())
            { 
                SignedUrlResumableUpload signedUrlResumableUpload = SignedUrlResumableUpload.Create(url, stream);
                signedUrlResumableUpload.ProgressChanged += Upload_ProgressChanged;
                signedUrlResumableUpload.ChunkSize = 10 * 1024 * 1024;
                return await signedUrlResumableUpload.UploadAsync().ConfigureAwait(false);
            }
        }
        private static async Task<IUploadProgress> UploadStreamResumableAsync(string filePath, string url)
        {
            using (FileStream stream = File.OpenRead(filePath))
            {
                SignedUrlResumableUpload signedUrlResumableUpload = SignedUrlResumableUpload.Create(url, stream);
                signedUrlResumableUpload.ProgressChanged += Upload_ProgressChanged;
                signedUrlResumableUpload.ChunkSize = 10 * 1024 * 1024;
                return await signedUrlResumableUpload.UploadAsync().ConfigureAwait(false);
            }
        }

        public async Task<string> UploadFileAsync(string filePath, string url, string authorization, string slbAccountId, string slbOnBehalfOf, string appKey)
        {
            HttpResponseMessage response = await GetSessionUri(url, authorization, slbAccountId, slbOnBehalfOf, appKey).ConfigureAwait(false);
            string responseEntity = await response.Content.ReadAsStringAsync().ConfigureAwait(false);
            if (response.StatusCode == HttpStatusCode.OK)
            {                
                SignedUrlResponse signedUrlResponse = JsonConvert.DeserializeObject<SignedUrlResponse>(responseEntity);

                // TODO: Once session URL service is fixed to use POST instead of GET, this logic has to be cleaned up
                if (signedUrlResponse.ResponseCode == Convert.ToInt32(HttpStatusCode.Created))
                {
                    IUploadProgress uploadProgress = await UploadStreamResumableAsync(filePath, GetLocationUrlWithoutUploadId(signedUrlResponse.LocationUrl)).ConfigureAwait(false);

                    if (!uploadProgress.Status.Equals(UploadStatus.Completed) && uploadProgress.Exception != null)
                    {
                        throw new Exception($"Error while uploading file on google bucket.  Message: {uploadProgress.Exception.Message} Stacktrace: {uploadProgress.Exception.StackTrace}");
                    }

                    return signedUrlResponse.RelativeFilePath;
                }
                else
                {
                    throw new Exception($"Problem with SignedURL API.  Message: {signedUrlResponse.ErrorMessage} Details: {signedUrlResponse.ErrorContent}");
                }
            }

            return responseEntity;
        }
        public async Task<string> UploadFileAsyncFromFile(IFormFile file, string url, string authorization, string slbAccountId, string slbOnBehalfOf, string appKey)
        {
            HttpResponseMessage response = await GetSessionUri(url, authorization, slbAccountId, slbOnBehalfOf, appKey).ConfigureAwait(false);
            string responseEntity = await response.Content.ReadAsStringAsync().ConfigureAwait(false);
            if (response.StatusCode == HttpStatusCode.OK)
            {
                SignedUrlResponse signedUrlResponse = JsonConvert.DeserializeObject<SignedUrlResponse>(responseEntity);

                // TODO: Once session URL service is fixed to use POST instead of GET, this logic has to be cleaned up
                if (signedUrlResponse.ResponseCode == Convert.ToInt32(HttpStatusCode.Created))
                {
                    IUploadProgress uploadProgress = await UploadStreamResumableAsyncFromFile(file, GetLocationUrlWithoutUploadId(signedUrlResponse.LocationUrl)).ConfigureAwait(false);

                    if (!uploadProgress.Status.Equals(UploadStatus.Completed) && uploadProgress.Exception != null)
                    {
                        throw new Exception($"Error while uploading file on google bucket.  Message: {uploadProgress.Exception.Message} Stacktrace: {uploadProgress.Exception.StackTrace}");
                    }

                    return signedUrlResponse.RelativeFilePath;
                }
                else
                {
                    throw new Exception($"Problem with SignedURL API.  Message: {signedUrlResponse.ErrorMessage} Details: {signedUrlResponse.ErrorContent}");
                }
            }

            return responseEntity;
        }

        private static string GetLocationUrlWithoutUploadId(string locationUrl)
        {
            int index = locationUrl.IndexOf("&upload_id");
            if (index != -1)
            {
                return locationUrl.Remove(index);
            }
            return locationUrl;
        }

        private async Task<HttpResponseMessage> GetSessionUri(string requestUri, string authorization, string slbDataPartitionId, string slbOnBehalfOf, string appKey)
        {
            using (HttpClient httpClient = new HttpClient())
            {
                System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Tls12;
                httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue(Constants.Bearer, authorization);
                httpClient.DefaultRequestHeaders.Add(Constants.SlbOnBehalfOf, slbOnBehalfOf);
                httpClient.DefaultRequestHeaders.Add(Constants.slbDataPartitionId, slbDataPartitionId);
                httpClient.DefaultRequestHeaders.Add(Constants.AppKey, appKey);
                return await httpClient.GetAsync(requestUri);
            }
        }
    }
}
