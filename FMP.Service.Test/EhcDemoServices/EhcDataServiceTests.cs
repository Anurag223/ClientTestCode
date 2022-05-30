using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Dynamic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using FluentAssertions;
using FMP.Service.Clients.EhcApi;
using FMP.Service.Ehc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace FMP.Service.Test.EhcDemoServices
{
    [TestClass]
    public class EhcDataServiceTests
    {
        private readonly DateTimeOffset _childEpisodeStartTime = DateTimeOffset.Parse("2019-04-04T20:21:01-05:00");
        private readonly DateTimeOffset _childEpisodeEndTime = DateTimeOffset.Parse("2019-04-04T20:21:15-05:00");
        private const string wkeId = "101222319:522";
        private const string episodeId = "5dfd0d01c2236e0001022831";
        private const string correlationId = "6d091210-bc19-4247-8b53-83f115e369e8";
        private const string childEpisodeId = "5dfd0d01c2236e0000000000";

        [TestMethod]
        [Ignore("The DateTimeOffset on the build server does not take into account the time zone. Will need to investigate it.")]
        public async Task GenerateChildEpisodes_HappyPath()
        {
            var odmNotifierMock = CreateOdmNotifierMock();
            var ehcClientMock = CreateEhcClientMock();
            var service = new EhcDataService(odmNotifierMock.Object, ehcClientMock.Object);
            var response = await service.CreateChildEpisodesAndEpisodicPoints(episodeId, wkeId, correlationId);
            response.Should().Be("Success");
        }

        private Mock<IEhcApiClient> CreateEhcClientMock()
        {
            var ehcClientMock = new Mock<IEhcApiClient>(MockBehavior.Strict);
            ehcClientMock
                .Setup(x => x.GetEpisodeByIdAsync("5dfd0d01c2236e0001022831"))
                .ReturnsAsync(ReadEpisode());

            ehcClientMock
                .Setup(x => x.GetChannelsAsync(wkeId, It.IsAny<string>(), It.IsAny<string>(), "CMDV.V,CMPR.kPa"))
                .ReturnsAsync(ReadChannelData());

            ehcClientMock
                .Setup(x => x.CreateEpisodeAsync(It.IsAny<Episode>()))
                .Callback<Episode>(VerifyEpisode)
                .ReturnsAsync(new Episode() { Id = childEpisodeId, StartTime = _childEpisodeStartTime, EndTime = _childEpisodeEndTime});

            ehcClientMock
                .Setup(x => x.PostChannels2Async(wkeId, It.IsAny<object>()))
                .Callback<string, object>(VerifyEpisodicPoints)
                .ReturnsAsync(new string("Hey!"));

            return ehcClientMock;
        }

        private void VerifyEpisode(Episode episode)
        {
            episode.StartTime.Should().Be(_childEpisodeStartTime);
            episode.EndTime.Should().Be(_childEpisodeEndTime);
            episode.Name.Should().Be("Coring motor is in use");
            episode.EquipmentWkeIdList.Single().Should().Be(wkeId);
            episode.ParentId.Should().Be(episodeId);
            episode.Type.Should().Be("coring");
        }

        private static void VerifyEpisodicPoints(string incomingWkeId, object channelPayload)
        {
            incomingWkeId.Should().Be(wkeId);
            // TODO: Validate the episodic point itself. There should be only one, with the time equal to the end time of the episode.
            // Currently, it's tedious to check this against an anonymous object.
        }

        private MultipleChannels ReadChannelData()
        {
            return JsonConvert.DeserializeObject<MultipleChannels>(File.ReadAllText("EhcDemoServices\\channelData.json"));
        }

        private Episode ReadEpisode()
        {
            return JsonConvert.DeserializeObject<Episode>(File.ReadAllText("EhcDemoServices\\episode.json"));
        }

        private static Mock<IOdmNotifier> CreateOdmNotifierMock()
        {
            var odmNotifierMock = new Mock<IOdmNotifier>(MockBehavior.Strict);
            odmNotifierMock.Setup(x => x.NotifyOdm(wkeId, correlationId)).Returns(Task.Delay(10));
            return odmNotifierMock;
        }
    }

    public static class DynamicExtensions {
        public static dynamic ToDynamic(this object value) {
            IDictionary<string, object> expando = new ExpandoObject();

            foreach (PropertyDescriptor property in TypeDescriptor.GetProperties(value.GetType()))
                expando.Add(property.Name, property.GetValue(value));

            return expando as ExpandoObject;
        }
    }
}
