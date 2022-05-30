using FMP.Model.MateoDataModel;
using FMP.Service.Mateo.Interface;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using FMPMateo = FMP.Model.MateoDataModel.Mateo;

namespace FMP.Service.Mateo
{
    public class mateoService:ImateoService
    {
        private IConfiguration _configuration;


        public mateoService(IConfiguration configuration)
        {
            _configuration = configuration;

        }


        public async Task<List<FMPMateo>> GetmateoDataBySite(List<string> sites,string token)
        {
            bool isProcessOwnersitesAgain = true;
            bool isProcessRepairsitesAgain = true;
            int pageNumber = 1;
            string pageSize = _configuration["mateoPageSize"];
            List<MateoResponseDataModel> mateoResponseDataModelAll = new List<MateoResponseDataModel>();
            while(isProcessOwnersitesAgain)
            {
                string url = GetMateoUrl(sites, pageNumber, pageSize,false);

                string stringResult = await GetMateoDataString(url, token);
                var mateoResponseData = ParseMateoJsonDataToObject(stringResult);
                mateoResponseDataModelAll.AddRange(mateoResponseData.mateoResponseDataModel);
                if (mateoResponseData.totalcount > mateoResponseData.mateoResponseDataModel.Count())
                {
                    pageNumber = pageNumber + 1;
                    pageSize = (mateoResponseData.totalcount - mateoResponseData.mateoResponseDataModel.Count()).ToString();

                }
                else
                {
                    isProcessOwnersitesAgain = false;
                }
               
            }
            pageNumber = 1;
            pageSize = _configuration["mateoPageSize"];
            while (isProcessRepairsitesAgain)
            {
                string url = GetMateoUrl(sites, pageNumber, pageSize, true);

                string stringResult = await GetMateoDataString(url, token);
                var mateoResponseData = ParseMateoJsonDataToObject(stringResult);
                mateoResponseDataModelAll.AddRange(mateoResponseData.mateoResponseDataModel);
                if (mateoResponseData.totalcount > mateoResponseData.mateoResponseDataModel.Count())
                {
                    pageNumber = pageNumber + 1;
                    pageSize = (mateoResponseData.totalcount - mateoResponseData.mateoResponseDataModel.Count()).ToString();

                }
                else
                {
                    isProcessRepairsitesAgain = false;
                }
            }
            var finalDistinctMateoResult = mateoResponseDataModelAll.Distinct(new ItemEqualityComparer()).ToList<MateoResponseDataModel>();
            var mateoResult = ProcessMateoData(finalDistinctMateoResult);
            //var fmpResult = await MergeMateoDataWithFMP(mateoResult, sites);

            //return fmpResult;
            return null;

        }

      

        private async Task<string> GetMateoDataString(string url, string token)
        {
            WebRequest request = WebRequest.Create(url);
            request.Method = "GET";
            request.Headers.Add("Authorization", token);
            WebResponse response = null;
            response = await request.GetResponseAsync();
            string mateoStringtringResult = null;
            using (Stream stream = response.GetResponseStream())
            {
                StreamReader sr = new StreamReader(stream);
                mateoStringtringResult = sr.ReadToEnd();
                sr.Close();
            }
            return mateoStringtringResult;
        }

        private string GetMateoUrl(List<string> ownerSiteCode,int pageNumber ,string pageSize, bool isRepairSite)
        {
            var include = _configuration["include"];
            var url = _configuration["mateo2Url"] + "equipment?";
    
            if (pageSize.Length>0)
            {
                url = url + "page[number]=" + pageNumber;
                url = url + "&page[size]=" + pageSize;
                url = url + "&sort=-ModifiedDate";
            }
            if(!isRepairSite)
            {
                url = url + "&filter[ownerSiteCode]=" + String.Join(",", ownerSiteCode);
            }
            else
            {
                url = url + "&filter[ownerSiteCode]="+"ne:" + String.Join(",", ownerSiteCode);
                url = url + "&filter[workorders.repairsitecode]=" + String.Join(",", ownerSiteCode);
            }
            if(include.Length>0)
            {

                url = url + "&include=" + include;
            }
            return url;
        }

        private MateoDataResponse ParseMateoJsonDataToObject(string stringResult)
        {
            JObject jsobjectResult = JObject.Parse(stringResult);
            JArray jresultArray = (JArray)jsobjectResult["collection"];
            string totalcount = jsobjectResult["meta"]["totalCount"].ToString();
            MateoDataResponse mateoDataResponse = new MateoDataResponse();
            List<MateoResponseDataModel> mateoResponseDataModel = jresultArray.ToObject<List<MateoResponseDataModel>>();
            mateoDataResponse.mateoResponseDataModel = mateoResponseDataModel;
            mateoDataResponse.totalcount = Convert.ToInt32(totalcount);

            return mateoDataResponse;
        }
        private List<FMPMateo> ProcessMateoData(List<MateoResponseDataModel> mateoResponseDataModels)
        {
            List<FMPMateo> ProcessedData = new List<FMPMateo>();
            foreach (var currentData in mateoResponseDataModels)
            {
                var data = new FMPMateo();
                data.Equipment_Code = currentData.equipmentCode;
                data.Serial_Number = currentData.sourceSystemRecordId;
                data.ownerSiteCode = currentData.ownerSiteCode;
                foreach (var workOrder in currentData.workorders)
                {
                    data.WO_Duration = workOrder.description;
                    data.WO_Number = workOrder.workorderNumber;
                    data.WO_Type = workOrder.maintenanceActivitySubType;
                    data.WO_Status = workOrder.workorderStatusValue;
                    data.RepairSiteCode = workOrder.repairSiteCode;
                    ProcessedData.Add(data);
                }
                if (currentData.workorders.Count() == 0)
                {
                    ProcessedData.Add(data);
                }

            };

            return ProcessedData;
        }
    }
}
