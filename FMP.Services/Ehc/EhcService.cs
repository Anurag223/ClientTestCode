using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Deedle;
using FMP.Service.Clients.EhcApi;
using MoreLinq.Extensions;
using Newtonsoft.Json;
using Serilog;

namespace FMP.Service.Ehc
{
    /// <inheritdoc />
    public class EhcDataService : IEhcDataService
    {
        private readonly IOdmNotifier _odmNotifier;
        private readonly IEhcApiClient _ehcApiClient;
        private IEhcApiClient _client;

        /// <inheritdoc />
        public EhcDataService(IOdmNotifier odmNotifier, IEhcApiClient ehcApiClient)
        {
            _odmNotifier = odmNotifier;
            _ehcApiClient = ehcApiClient;
            _client = _ehcApiClient;
        }
        /// <inheritdoc />
        public async Task<string> CreateChildEpisodesAndEpisodicPoints(string episodeId, string wkeId, string correlationId)
        {
            var episode = await _client.GetEpisodeByIdAsync(episodeId);
            if (episode == null) return null;

            // TODO: Search by parent ID - do not create if there are any already.
            var newEpisodes = await CreateChildEpisodes(episode, wkeId, correlationId);
            await _odmNotifier.NotifyOdm(wkeId, correlationId);
            return "Success";
        }
        public async Task<string> getODMStatus(string correlationId)
        {
           return  await _odmNotifier.GetODMStatus(correlationId);
        }

        private async Task<object> CreateChildEpisodes(Episode episode, string wkeId, string correlationId)
        {
         
            var timeSeries = await GetRawEpisodeData(wkeId, new[] {"CMDV.V", "CMPR.kPa"}, episode.StartTime.Value.AddDays(-2), episode.EndTime);

            var childEpisodes = ParseChildEpisodes(wkeId, episode.Id, correlationId, timeSeries);
            await SaveChildEpisodes(childEpisodes, episode.Id, wkeId, correlationId);

            var episodicPoints = ParseEpisodicPoints(childEpisodes);
            var saveEpisodicPointsResult = SaveEpisodicPoints(episodicPoints);

            return "Yay!";
        }

        private async Task<Series<DateTimeOffset, (float, float)>> GetRawEpisodeData(string wkeId, string[] channelNames, DateTimeOffset? startTime, DateTimeOffset? endTime)
        {
            var challenCodesCsv = string.Join(",", channelNames);
            var channelData1 = await _client.GetChannelsAsync(wkeId, startTime?.ToString(), endTime?.ToString(), challenCodesCsv);
            return ParseTimeSeries(channelData1);
        }

        private object SaveEpisodicPoints(object episodicPoints)
        {
            return new object();
        }

        private object ParseEpisodicPoints(object childEpisodes)
        {
            return new object();
        }

        private async Task SaveChildEpisodes(IEnumerable<Episode> childEpisodes, string episodeId, string wkeId, string correlationId)
        {
            foreach (var episode in childEpisodes)
            {
                var createEpisodeResult = await _client.CreateEpisodeAsync(episode);
                Log.Information("Created a child episode. Response: {response}", createEpisodeResult);

                var createEpisodicPointResult = await CreateEpisodicPointAsync(createEpisodeResult, wkeId);
                var channelData = new
                {
                    meta = new
                    {
                        episodeId = episodeId,
                        channels = new[]
                        {
                            new
                            {
                                index = 0,
                                code = "time",
                                uom = "d",
                                dimension = "time"
                            },
                            new
                            {
                                index = 1,
                                code = "eMOT",
                                uom = "h",
                                dimension = "time"
                            }
                        }
                    },
                    rows = new[]
                    {
                        new[]
                        {
                            new object[] {0, "2019-03-29T15:30:02.156Z"},
                            new object[] {1, 1.56}
                        }
                    }
                };
                var createEpisodicPoints = await _client.PostChannels2Async(wkeId, channelData);
                Log.Information("Created episodic points. Response: {response}", createEpisodicPoints);
            }
        }

        private async Task<string> CreateEpisodicPointAsync(Episode childEpisode, string wkeId)
        {
            if (!childEpisode.StartTime.HasValue || !childEpisode.EndTime.HasValue)
                throw new ArgumentException("The episode should have start and end time defined.");

            var channelData = new
            {
                meta = new
                {
                    episodeId = childEpisode.Id,
                    channels = new[]
                    {
                        new
                        {
                            index = 0,
                            code = "time",
                            uom = "d",
                            dimension = "time"
                        },
                        new
                        {
                            index = 1,
                            code = "eMOT",
                            uom = "h",
                            dimension = "time"
                        }
                    }
                },
                rows = new[]
                {
                    new[]
                    {
                        new object[] {0, childEpisode.EndTime.Value},
                        new object[] {1, (childEpisode.EndTime.Value - childEpisode.StartTime.Value).TotalHours}
                    }
                }
            };

            var createEpisodicPoints = await _client.PostChannels2Async(wkeId, channelData);
            Log.Information("Created episodic points. Response: {response}", createEpisodicPoints);

            return createEpisodicPoints;
        }

        private IEnumerable<Episode> ParseChildEpisodes(string wkeId, string parentEpisodeId, string correlationId, Series<DateTimeOffset, (float, float)> timeSeries)
        {
            DateTimeOffset? start = null;
            
            foreach (var ts in timeSeries.Observations)
            {
                var voltage = ts.Value.Item1;
                var pressure = ts.Value.Item2;

                if (voltage > 70 && pressure > 70 && start == null)
                    start = ts.Key;

                if ((voltage <= 40 || pressure <= 50) && start != null)
                {
                    DateTimeOffset? end = ts.Key;
                    yield return PopulateEpisode(start.Value, end.Value, wkeId, parentEpisodeId, correlationId);
                    start = null;
                }
            }
        }

        private Episode PopulateEpisode(DateTimeOffset start, DateTimeOffset end, string wkeId, string parentEpisodeId, string correlationId)
        {
            Guid id = Guid.NewGuid();
            string avatarRunId = Guid.NewGuid().ToString();
            return new Episode
            {
                StartTime = start,
                EndTime = end,
                EquipmentWkeIdList = new List<string>() { wkeId },
                ParentId = parentEpisodeId,
                Name = "Coring motor is in use",
                Type = "coring",
                Tags = new List<string>() {
                    "slb-correlation-id:"+correlationId,
                    "avatar-id:purinaAvSim",
                    "avatar-run-id:"+avatarRunId}
            };
        }

        private Series<DateTimeOffset, (float, float)> ParseTimeSeries(MultipleChannels channelData)
        {
            var timeSeries = new SeriesBuilder<DateTimeOffset, (float, float)>();
            foreach (var channelDataRow in channelData.Rows.DistinctBy(x => x.First().ToString()))
            {
                var time = DateTime.Parse(channelDataRow.First().ToString());
                var val1 = float.Parse(channelDataRow.Skip(1).First().ToString());
                var val2 = float.Parse(channelDataRow.Skip(2).First().ToString());
                timeSeries.Add(time, (val1, val2));
            }
            return timeSeries.Series;
        }
    }
}
