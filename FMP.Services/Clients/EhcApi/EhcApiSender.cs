using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace FMP.Service.Clients.EhcApi
{
    public class EhcApiSender
    {
        const string baseUrl = "https://api.ehc.qa.slb.com";
//        const string baseUrl = "http://mylocalhost:8216";
        private const string tokenUrl = "http://auth.dev.tlm.slb.com/connect/token";

        private IEhcApiClient _client;

        public EhcApiSender(IEhcApiClient client)
        {
            _client = client;
        }
        
        public async Task SendDataRow(string wkeid, string[] header, DateTime timestamp, double?[] values)
        {
            ChannelData channelData = new ChannelData();

            for (int i = 0; i < header.Length; i++)
            {
                channelData.meta.channels.Add(new Channel()
                {
                    index = i,
                    code = header[i],
                    uom = "",
                    dimension = ""
                });
            }

            var list = new List<List<object>>();
            channelData.rows.Add(list);

            list.Add(new List<object>(){0, timestamp});

            for (int i = 0; i < values.Length; i++)
            {
                list.Add(new List<object>(){ i + 1, values[i] });
            }

            await _client.PostChannelsAsync(wkeid, channelData);
        }


        public class ChannelData
        {
            public ChannelData()
            {
                this.meta = new Meta();
                this.meta.channels = new List<Channel>();
                this.rows = new List<List<List<object>>>();
            }

            public Meta meta { get; set; }
            public List<List<List<object>>> rows { get; set; }
        }

        public class Meta
        {
            public List<Channel> channels { get; set; }
        }

        public class Channel
        {
            public int index { get; set; }
            public string code { get; set; }
            public string uom { get; set; }
            public string dimension { get; set; }
        }


    }
}
