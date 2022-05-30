using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Text;

namespace FMP.Model.Common
{
    public class ReleaseNoteModel
    {
        public ObjectId _id { get; set; }
        public long ReleaseNoteid { get; set; }
        public string ReleaseNotes { get; set; }
        public string DownTimeStart { get; set; }
        public string DownTimeEnd { get; set; }
        public string CreatedBy { get; set; }
        public string CreatedDate { get; set; }
        public Boolean IsAvtive { get; set; }
    }
}
