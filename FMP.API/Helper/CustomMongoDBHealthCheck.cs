using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FMP.Common;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using MongoDB.Driver;
using Serilog;

namespace FMP.API.Helper
{
    public static class MongoDbHealthCheckBuilderExtensions
    {
        private const string NAME = "mongodb";

        /// <summary>
        ///     Add a health check for MongoDb database that list all databases on the system.
        /// </summary>
        /// <param name="builder">The <see cref="IHealthChecksBuilder" />.</param>
        /// <param name="mongodbConnectionString">The MongoDb connection string to be used.</param>
        /// <param name="name">The health check name. Optional. If <c>null</c> the type name 'mongodb' will be used for the name.</param>
        /// <param name="failureStatus">
        ///     The <see cref="HealthStatus" /> that should be reported when the health check fails. Optional. If <c>null</c> then
        ///     the default status of <see cref="HealthStatus.Unhealthy" /> will be reported.
        /// </param>
        /// <param name="tags">A list of tags that can be used to filter sets of health checks. Optional.</param>
        /// <returns>The <see cref="IHealthChecksBuilder" />.</returns>
        public static IHealthChecksBuilder AddMongoDb2(this IHealthChecksBuilder builder, string mongodbConnectionString, string name = default, HealthStatus? failureStatus = default, IEnumerable<string> tags = default)
        {
            return builder.Add(new HealthCheckRegistration(
                name ?? NAME,
                sp => new MongoDbHealthCheck2(mongodbConnectionString),
                failureStatus,
                tags));
        }

        /// <summary>
        ///     Add a health check for MongoDb database that list all collections from specified database on
        ///     <paramref name="mongoDatabaseName" />.
        /// </summary>
        /// <param name="builder">The <see cref="IHealthChecksBuilder" />.</param>
        /// <param name="mongodbConnectionString">The MongoDb connection string to be used.</param>
        /// <param name="mongoDatabaseName">The Database name to check.</param>
        /// <param name="name">The health check name. Optional. If <c>null</c> the type name 'mongodb' will be used for the name.</param>
        /// <param name="failureStatus">
        ///     The <see cref="HealthStatus" /> that should be reported when the health check fails. Optional. If <c>null</c> then
        ///     the default status of <see cref="HealthStatus.Unhealthy" /> will be reported.
        /// </param>
        /// <param name="tags">A list of tags that can be used to filter sets of health checks. Optional.</param>
        /// <returns>The <see cref="IHealthChecksBuilder" />.</returns>
        public static IHealthChecksBuilder AddMongoDb2(this IHealthChecksBuilder builder, string mongodbConnectionString, string mongoDatabaseName, string name = default, HealthStatus? failureStatus = default, IEnumerable<string> tags = default)
        {
            return builder.Add(new HealthCheckRegistration(
                name ?? NAME,
                sp => new MongoDbHealthCheck2(mongodbConnectionString, mongoDatabaseName),
                failureStatus,
                tags));
        }

        /// <summary>
        ///     Add a health check for MongoDb database that list all collections from specified database on
        ///     <paramref name="mongoDatabaseName" />.
        /// </summary>
        /// <param name="builder">The <see cref="IHealthChecksBuilder" />.</param>
        /// <param name="mongoClientSettings">The MongoClientSettings to be used.</param>
        /// <param name="name">The health check name. Optional. If <c>null</c> the type name 'mongodb' will be used for the name.</param>
        /// <param name="failureStatus">
        ///     The <see cref="HealthStatus" /> that should be reported when the health check fails. Optional. If <c>null</c> then
        ///     the default status of <see cref="HealthStatus.Unhealthy" /> will be reported.
        /// </param>
        /// <param name="tags">A list of tags that can be used to filter sets of health checks. Optional.</param>
        /// <returns>The <see cref="IHealthChecksBuilder" />.</returns>
        public static IHealthChecksBuilder AddMongoDb(this IHealthChecksBuilder builder, MongoClientSettings mongoClientSettings, string name = default, HealthStatus? failureStatus = default, IEnumerable<string> tags = default)
        {
            return builder.Add(new HealthCheckRegistration(
                name ?? NAME,
                sp => new MongoDbHealthCheck2(mongoClientSettings),
                failureStatus,
                tags));
        }

        /// <summary>
        ///     Add a health check for MongoDb database that list all collections from specified database on
        ///     <paramref name="mongoDatabaseName" />.
        /// </summary>
        /// <param name="builder">The <see cref="IHealthChecksBuilder" />.</param>
        /// <param name="mongoClientSettings">The MongoClientSettings to be used.</param>
        /// <param name="mongoDatabaseName">The Database name to check.</param>
        /// <param name="name">The health check name. Optional. If <c>null</c> the type name 'mongodb' will be used for the name.</param>
        /// <param name="failureStatus">
        ///     The <see cref="HealthStatus" /> that should be reported when the health check fails. Optional. If <c>null</c> then
        ///     the default status of <see cref="HealthStatus.Unhealthy" /> will be reported.
        /// </param>
        /// <param name="tags">A list of tags that can be used to filter sets of health checks. Optional.</param>
        /// <returns>The <see cref="IHealthChecksBuilder" />.</returns>
        public static IHealthChecksBuilder AddMongoDb(this IHealthChecksBuilder builder, MongoClientSettings mongoClientSettings, string mongoDatabaseName, string name = default, HealthStatus? failureStatus = default, IEnumerable<string> tags = default)
        {
            return builder.Add(new HealthCheckRegistration(
                name ?? NAME,
                sp => new MongoDbHealthCheck2(mongoClientSettings, mongoDatabaseName),
                failureStatus,
                tags));
        }
    }

    public class MongoDbHealthCheck2
        : IHealthCheck
    {
        private static readonly ILogger Logger = Log.Logger.ForContext<MongoDbHealthCheck2>();

        public MongoDbHealthCheck2(string connectionString, string databaseName = default)
            : this(MongoClientSettings.FromUrl(MongoUrl.Create(connectionString)), databaseName)
        { }

        public MongoDbHealthCheck2(MongoClientSettings clientSettings, string databaseName = default)
        {
            _specifiedDatabase = databaseName;
            _mongoClientSettings = clientSettings;
        }

        public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
        {
            HealthCheckResult result;
            try
            {
                result = await CheckHealthIntAsync(context, cancellationToken);
            }
            catch (Exception ex)
            {
                Logger.Error("CheckHealthAsync ", ex);
                result = new HealthCheckResult(context.Registration.FailureStatus, exception: ex);
            }

            return result;
        }

        public async Task<HealthCheckResult> CheckHealthIntAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
        {
            var serverName = _mongoClientSettings.Servers.First().Host;
            if (!MongoClient.TryGetValue(serverName, out var mongoClient))
            {
                Logger.Warning("getting value for key=" + serverName);

                mongoClient = new MongoClient(_mongoClientSettings);

                if (!MongoClient.TryAdd(serverName, mongoClient))
                {
                    foreach (var key in MongoClient.Keys)
                    {
                        Logger.Warning("key={key}", key);
                    }

                    foreach (var client in MongoClient)
                    {
                        Logger.Warning("entry={entry}", client.ToDynamic());
                    }

                    Logger.Error("CheckHealthAsync New MongoClient can't be added into dictionary.");
                    return new HealthCheckResult(context.Registration.FailureStatus, "New MongoClient can't be added into dictionary.");
                }
            }

            if (!string.IsNullOrEmpty(_specifiedDatabase))
                await mongoClient
                    .GetDatabase(_specifiedDatabase)
                    .ListCollectionsAsync(cancellationToken: cancellationToken);
            else
                await mongoClient
                    .ListDatabasesAsync(cancellationToken);

            return HealthCheckResult.Healthy();
        }

        private static readonly ConcurrentDictionary<string, MongoClient> MongoClient = new ConcurrentDictionary<string, MongoClient>();
        private readonly MongoClientSettings _mongoClientSettings;
        private readonly string _specifiedDatabase;
    }
}
