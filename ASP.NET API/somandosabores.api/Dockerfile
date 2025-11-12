FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copiar apenas os arquivos de projeto primeiro para aproveitar o cache
COPY ["ASP.NET API/somandosabores.api/somandosabores.api.csproj", "somandosabores.api/"]
COPY ["ASP.NET API/infra/infra.csproj", "infra/"]
COPY ["ASP.NET API/domain/domain.csproj", "domain/"]

# Restaurar dependências
RUN dotnet restore "somandosabores.api/somandosabores.api.csproj"

# Copiar o resto dos arquivos
COPY ["ASP.NET API/", "."]

# Build
WORKDIR "/src/somandosabores.api"
RUN dotnet build "somandosabores.api.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "somandosabores.api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "somandosabores.api.dll"]
