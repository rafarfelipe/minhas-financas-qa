# Use the official .NET SDK image for building
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy csproj files and restore dependencies
COPY ["MinhasFinancas.API/MinhasFinancas.API.csproj", "MinhasFinancas.API/"]
COPY ["MinhasFinancas.Application/MinhasFinancas.Application.csproj", "MinhasFinancas.Application/"]
COPY ["MinhasFinancas.Domain/MinhasFinancas.Domain.csproj", "MinhasFinancas.Domain/"]
COPY ["MinhasFinancas.Infrastructure/MinhasFinancas.Infrastructure.csproj", "MinhasFinancas.Infrastructure/"]

RUN dotnet restore "MinhasFinancas.API/MinhasFinancas.API.csproj"

# Copy everything else and build
COPY . .
WORKDIR "/src/MinhasFinancas.API"
RUN dotnet build "MinhasFinancas.API.csproj" -c Release -o /app/build

# Publish the application
FROM build AS publish
RUN dotnet publish "MinhasFinancas.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Use the official ASP.NET runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
EXPOSE 80
ENTRYPOINT ["dotnet", "MinhasFinancas.API.dll"]