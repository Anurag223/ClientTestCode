FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-bionic AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/core/sdk:3.1-bionic AS build
WORKDIR /src
COPY ["FMP.API/FMP.API.csproj", "FMP.API/"]
RUN dotnet restore "FMP.API/FMP.API.csproj"
COPY . .
WORKDIR "/src/FMP.API"
RUN dotnet build /nowarn:cs1591 "FMP.API.csproj" -c Release -o /app

FROM build AS publish
RUN dotnet publish "FMP.API.csproj" -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "FMP.API.dll"]