

namespace Slb.Ingestion.Pipeline.Service.DotNetClient
{
    public class IngestionConfig
    {
        public IngestionConfig(string slbId, InputType fileInput, string kind, string acl, string legaltags, string ingestorRoutines, 
            string enrichmentRoutines, string slbOnBehalfOf, string appKey, string authorization=null)
        {

            SlbDataPartitionId = slbId;
            Authorization = authorization;
            AppKey = appKey;
            FileInput = fileInput;
            Kind = kind;
            Acl = acl;
            Legaltags = legaltags;
            SlbOnBehalfOf = slbOnBehalfOf;
            IngestorRoutines = ingestorRoutines;
            EnrichmentRoutines = enrichmentRoutines;
        }

        public string SlbDataPartitionId { get; private set; }
        public string Authorization { get; set; }
        public string AppKey { get; private set; }
        public InputType FileInput { get; private set; }
        public string Kind { get; private set; }
        public string Acl { get; private set; }
        public string Legaltags { get; private set; }
        public string IngestorRoutines { get; private set; }
        public string EnrichmentRoutines { get; private set; }
        public string SlbOnBehalfOf { get; private set; }


    }
}
