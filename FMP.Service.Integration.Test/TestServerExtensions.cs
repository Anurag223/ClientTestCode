using System;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;

namespace FMP.Service.Integration.Test
{
    public static class TestServerExtensions
    {
        public static TestServer CreateServer<TStartup>(string webProjectFolderName,
            Action<IServiceCollection> configureTestServicesAction = null)
            where TStartup : class
        {
            OverrideConfiguration();

            var hostBuilder = new WebHostBuilder()
                .UseSolutionRelativeContentRoot(webProjectFolderName)
                .UseEnvironment("Local")
                .ConfigureServices(configureTestServicesAction ?? delegate { })
                .UseStartup<TStartup>();

            return new TestServer(hostBuilder);

            void OverrideConfiguration()
            {
                // Environment.SetEnvironmentVariable("Serilog__MinimumLevel__Default", "Debug");
            }
        }
    }
}