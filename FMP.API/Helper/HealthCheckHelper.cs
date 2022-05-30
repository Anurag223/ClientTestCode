using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FMP.API.Helper
{
    public static class HealthCheckHelper
    {
        public static string mongoDBConnectionString;
        public static string mongoDBConnectionDataBaseString;
        /// <summary>
        /// Helper Method to Add the required HealthChecks for FMP UI API.
        /// </summary>
        /// <param name="services"></param>
        /// <param name="config">AppSettings Configuration.</param>
        public static void AddFMPHealthCheck(this IServiceCollection services, IConfiguration config)
        {
            mongoDBConnectionString = config["MongoConnection:ConnectionString"];
            mongoDBConnectionDataBaseString = config["MongoConnection:Database"];
            services
                .AddHealthChecks() // Add Health Check
                .AddIdentityServer(new Uri(config["IdentityUrl"]), "IdentityServer", HealthStatus.Unhealthy) // Check Identity Server
                .AddMongoDb2(mongoDBConnectionString, mongoDBConnectionDataBaseString, "MongoDB", HealthStatus.Unhealthy); //Check MongoDB
        }

        /// <summary>
        /// Helper method to configure and use  the HealthCheck.
        /// </summary>
        /// <param name="app"></param>
        public static void UseFMPHealthCheck(this IApplicationBuilder app)
        {
            //HealthCheck is accesible at {base_url}/api/HealthCheck
            app.UseHealthChecks("/api/HealthCheck", new HealthCheckOptions()
            {
                // WriteHealthCheckResponse is a delegate used to write the response.
                // Check below to view the method details.
                ResponseWriter = WriteHealthCheckResponse,
                ResultStatusCodes =
                {
                    //Return Status 200 Response for Healthy Result.
                    [HealthStatus.Healthy] = StatusCodes.Status200OK,
                    //Return Status 417 Response if Status is not Healthy.
                    [HealthStatus.Degraded] = StatusCodes.Status417ExpectationFailed,
                    [HealthStatus.Unhealthy] = StatusCodes.Status417ExpectationFailed
                }
            });
        }

        /// <summary>
        /// Helper Method that tansforms the HealthCheck results to Json responses.
        /// </summary>
        /// <param name="httpContext"></param>
        /// <param name="result"></param>
        /// <returns>Sample Response:
        /// {
        ///     "status" : "fail",
        ///     "time": "xx ms"
        ///     "data" : {
        ///       "identityserver": { "status": "error", "time": "xx ms", "messages": ["Exception Message", "Inner Exception Message"]  },
        ///       "mongodb": { "status": "success", "time": "xx ms", "messages": [] }
        ///     }
        /// }
        /// </returns>
        private static Task WriteHealthCheckResponse(HttpContext httpContext, HealthReport result)
        {
            httpContext.Response.ContentType = "application/json";

            JObject json = new JObject(
                new JProperty("status", ParseStatus(result.Status)),
                new JProperty("time", $"{result.TotalDuration.TotalMilliseconds} ms"),
                new JProperty("data", new JObject(
                    result.Entries.Select(pair => CreateHealthStatusResponse(pair)))
                ));
            return httpContext.Response.WriteAsync(
                json.ToString(Formatting.Indented));
        }

        /// <summary>
        /// Creates a response from the HealthCHeck Response.
        /// </summary>
        /// <param name="pair"></param>
        /// <returns></returns>
        private static JProperty CreateHealthStatusResponse(KeyValuePair<string, HealthReportEntry> pair)
        {
            JObject content = new JObject(
                new JProperty("status", ParseStatus(pair.Value.Status)),
                new JProperty("time", $"{pair.Value.Duration.TotalMilliseconds} ms"));

            JArray messages = new JArray();
            if (pair.Key == "MongoDB")
            {
                messages.Add(mongoDBConnectionString);
                messages.Add(mongoDBConnectionDataBaseString);
            }

            if (!string.IsNullOrWhiteSpace(pair.Value.Description))
            {
                messages.Add(pair.Value.Description);
            }
            // If HealthCheck Status is not Healty and Exception occured add the Exception messages to response as well.
            if (pair.Value.Status != HealthStatus.Healthy && pair.Value.Exception != null)
            {
                ExtractExceptionMessages(messages, pair.Value.Exception);
            }
            content.Add("messages", messages);
            return new JProperty(pair.Key.ToLowerInvariant(), content);
        }

        /// <summary>
        /// Extracts all the messages from the Exception/InnerExceptions into an array.
        /// </summary>
        /// <param name="messages"></param>
        /// <param name="exception"></param>
        /// <returns></returns>
        private static JArray ExtractExceptionMessages(JArray messages, Exception exception)
        {

            messages.Add(exception.Message);
            if (exception.InnerException != null)
            {
                // If InnerException exists extract its error message as well.
                ExtractExceptionMessages(messages, exception.InnerException);
            }
            return messages;
        }

        private static string ParseStatus(HealthStatus status)
        {
            switch (status)
            {
                case HealthStatus.Healthy:
                    return "success";
                case HealthStatus.Degraded:
                    return "degraded";
                case HealthStatus.Unhealthy:
                    return "error";
                default:
                    return status.ToString();
            }
        }
    }
}
