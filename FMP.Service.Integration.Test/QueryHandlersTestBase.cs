#region Header

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

using FMP.Model.Common;
using FMP.Repository.Context;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Moq;

namespace FMP.Service.Integration.Test
{
    public class QueryHandlersTestBase
    {
        protected FMPContext Context;
        protected Mock<IOptions<Settings>> MockOptions;

        protected MockRepository MockRepository;
        protected MongoDbClient MongoDbClient;
        protected Settings Settings;


        public void DeleteAllMongoData()
        {
            var client = new MongoClient(Settings.ConnectionString);
            client.DropDatabase(Settings.Database);
        }

        protected virtual void Init()
        {
            Settings = new Settings {ConnectionString = "mongodb://localhost:27017", Database = "FMPServiceDB"};

            MockRepository = new MockRepository(MockBehavior.Strict);
            MockOptions = MockRepository.Create<IOptions<Settings>>();
            MockOptions.Setup(x => x.Value).Returns(Settings);

            DeleteAllMongoData();
            Context = new FMPContext(MockOptions.Object);

            MongoDbClient = new MongoDbClient(MockOptions.Object);
        }
    }
}