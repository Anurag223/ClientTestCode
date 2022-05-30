﻿#region Header

/// <summary>
/// Schlumberger Private
/// Copyright 2018 Schlumberger.All rights reserved in Schlumberger
/// authored and generated code(including the selection and arrangement of
/// the source code base regardless of the authorship of individual files),
/// but not including any copyright interest(s) owned by a third party
/// related to source code or object code authored or generated by
/// non-Schlumberger personnel.
/// This source code includes Schlumberger confidential and/or proprietary
/// information and may include Schlumberger trade secrets.Any use,
/// disclosure and/or reproduction is prohibited unless authorized in
/// writing.
/// </summary>

#endregion

#pragma warning disable 1591
using System.Linq;
using System.Threading.Tasks;
using FizzWare.NBuilder;
using FluentAssertions;
using FMP.Model.UserProfileDataModel;
using FMP.Service.UserProfile;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using MongoDB.Bson;
using MongoDB.Driver;
using FMPUserProfile = FMP.Model.UserProfileDataModel.UserProfile;

namespace FMP.Service.Integration.Test
{
    [TestClass]
    [IntegrationTestCategory]
    public class UpdateUserProfilesTests : QueryHandlersTestBase
    {
        protected IMongoDbCollection<FMPUserProfile> UserProfilesColl;

        [TestInitialize]
        public void TestInitialize()
        {
            Init();
            UserProfilesColl = new MongoDbCollection<FMPUserProfile>(MongoDbClient);
        }

        [TestMethod]
        public async Task Handle_UpdatePreference_Updated()
        {
            var testLayout = Builder<FMPUserProfile>.CreateNew().Build();

            await UserProfilesColl.Collection.InsertOneAsync(testLayout);

            var testLayout2 = Builder<FMPUserProfile>.CreateNew().Build();
            testLayout2.UserID = testLayout.UserID;

            await UserProfilesColl.Collection.InsertOneAsync(testLayout2);

            var initial = await UserProfilesColl.Collection.Find(s => s.UserID==testLayout.UserID)
                .ToListAsync();
            initial.Should().NotBeNull();
            initial.Count.Should().Be(2);
            
            var newPreference = Builder<UserPreference>.CreateNew().Build();
            var query = UpdateUserProfilesCommand
                .WithFilter(UserProfileFilter.By(testLayout2.UserID))
                .UpdateMany()
                .SetPreference(newPreference);

            var handler = new UpdateEntityHandler<FMPUserProfile>(UserProfilesColl);

            var result = await handler.Handle(query);

            result.Should().BeTrue();
            var updated = await UserProfilesColl.Collection.Find(s => s.UserID.Equals(testLayout.UserID))
                .ToListAsync();

            updated.First().SavedPreference.Should().BeEquivalentTo(newPreference);
            updated.Skip(1).First().SavedPreference.Should().BeEquivalentTo(newPreference);
        }

        [TestMethod]
        public async Task Handle_UpdateLastReleaseNoteDismiss_Updated()
        {
            var testLayout = Builder<FMPUserProfile>.CreateNew().Build();

            await UserProfilesColl.Collection.InsertOneAsync(testLayout);

            var testLayout2 = Builder<FMPUserProfile>.CreateNew().Build();
            testLayout2.UserID = testLayout.UserID;

            await UserProfilesColl.Collection.InsertOneAsync(testLayout2);

            var initial = await UserProfilesColl.Collection.Find(s => s.UserID == testLayout.UserID)
                .ToListAsync();
            initial.Should().NotBeNull();
            initial.Count.Should().Be(2);

            var lastReleaseNoteDismiss = 777;
            var query = UpdateUserProfilesCommand
                .WithFilter(UserProfileFilter.By(testLayout2.UserID))
                .SetLastReleaseNoteDismiss(lastReleaseNoteDismiss)
                .UpdateMany();

            var handler = new UpdateEntityHandler<FMPUserProfile>(UserProfilesColl);

            var result = await handler.Handle(query);

            result.Should().BeTrue();
            var updated = await UserProfilesColl.Collection.Find(s => s.UserID.Equals(testLayout.UserID))
                .ToListAsync();

            updated.First().LastReleaseNoteDismiss.Should().Be(lastReleaseNoteDismiss);
            updated.Skip(1).First().LastReleaseNoteDismiss.Should().Be(lastReleaseNoteDismiss);
        }

        [TestMethod]
        public async Task Handle_NoUpdates_False()
        {
            var userId = "userId";

            var query = UpdateUserProfilesCommand
                .WithFilter(UserProfileFilter.By(userId))
                .UpdateMany();

            var handler = new UpdateEntityHandler<FMPUserProfile>(UserProfilesColl);

            var result = await handler.Handle(query);

            result.Should().BeFalse();
        }

        [TestMethod]
        public async Task Handle_UpdateRefreshInterval_Updated()
        {
            var testLayout = Builder<FMPUserProfile>.CreateNew().Build();

            await UserProfilesColl.Collection.InsertOneAsync(testLayout);

            var testLayout2 = Builder<FMPUserProfile>.CreateNew().Build();
            testLayout2.UserID = testLayout.UserID;

            await UserProfilesColl.Collection.InsertOneAsync(testLayout2);

            var initial = await UserProfilesColl.Collection.Find(s => s.UserID == testLayout.UserID)
                .ToListAsync();
            initial.Should().NotBeNull();
            initial.Count.Should().Be(2);

            var refreshInterval = 111;
            var query = UpdateUserProfilesCommand
                .WithFilter(UserProfileFilter.By(testLayout2.UserID))
                .SetRefreshInterval(refreshInterval)
                .UpdateMany();

            var handler = new UpdateEntityHandler<FMPUserProfile>(UserProfilesColl);

            var result = await handler.Handle(query);

            result.Should().BeTrue();
            var updated = await UserProfilesColl.Collection.Find(s => s.UserID.Equals(testLayout.UserID))
                .ToListAsync();

            updated.First().RefreshInterval.Should().Be(refreshInterval);
            updated.Skip(1).First().RefreshInterval.Should().Be(refreshInterval);
        }
    }
}