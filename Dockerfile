# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy everything into the container
COPY ./Backend/VulnerabilitySimulator.sln ./
COPY ./Backend/src ./src

# Build API
WORKDIR /src/VulnerabilitySimulator.Api
RUN dotnet restore
RUN dotnet publish -c Release -o /app/publish

# Stage 2: Run
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:80
EXPOSE 80

ENTRYPOINT ["dotnet", "VulnerabilitySimulator.Api.dll"]
