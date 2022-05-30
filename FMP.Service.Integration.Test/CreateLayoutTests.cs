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
using System.Threading.Tasks;
using FizzWare.NBuilder;
using FluentAssertions;
using FMP.Service.Layout;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using MongoDB.Driver;
using FMPLayout = FMP.Model.LayoutDataModel.Layout;

namespace FMP.Service.Integration.Test
{
    [TestClass]
    [IntegrationTestCategory]
    public class CreateLayoutTests : QueryHandlersTestBase
    {
        protected IMongoDbCollection<FMPLayout> LayoutColl;

        [TestInitialize]
        public void TestInitialize()
        {
            Init();
            LayoutColl = new MongoDbCollection<FMPLayout>(MongoDbClient);
        }

        [TestMethod]
        public async Task Handle_ExistingUser_UserProfile()
        {
            var testLayout = Builder<FMPLayout>.CreateNew().Build();
            var before = await LayoutColl.Collection.Find(s => s.UserID.Equals(testLayout.UserID))
                .SingleOrDefaultAsync();
            before.Should().BeNull();

            var query = CreateLayoutCommand.From(testLayout);

            var handler = new CreateLayout(LayoutColl);

            var result = await handler.Handle(query);

            result.Should().BeTrue();
            var created = await LayoutColl.Collection.Find(s => s.UserID.Equals(testLayout.UserID))
                .SingleOrDefaultAsync();
            created.Should().NotBeNull();
        }
    }
}