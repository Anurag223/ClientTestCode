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

using FMP.Model.Common;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
#pragma warning disable 1591

namespace FMP.Service
{
    public class MongoDbClient : IMongoDbClient
    {
        /// <summary>
        /// FMP Database Initialization
        /// </summary>
        /// <param name="settings"></param>
        public MongoDbClient(IOptions<Settings> settings)
        {
            var client = new MongoClient(settings.Value.ConnectionString);
            Database = client.GetDatabase(settings.Value.Database);
        }

        public IMongoDatabase Database { get; }
    }
}
