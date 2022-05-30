using System;

namespace Slb.Ingestion.Pipeline.Service.DotNetClient.Data
{
    [Serializable]
    class AdditionalValueData
    {
        public string UserEmailAddress { get; set; }
        public string ServiceName { get; set; }
        public string ContentType { get; set; }
    }
}
