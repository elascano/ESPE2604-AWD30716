# Multi-stage Dockerfile - Optimizado para producción
# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copiar archivos de proyecto
COPY ["src/TaxProblem.Web/TaxProblem.Web.csproj", "TaxProblem.Web/"]

# Restaurar dependencias
RUN dotnet restore "TaxProblem.Web/TaxProblem.Web.csproj"

# Copiar código fuente
COPY ["src/TaxProblem.Web/", "TaxProblem.Web/"]

# Build
WORKDIR "/src/TaxProblem.Web"
RUN dotnet build "TaxProblem.Web.csproj" -c Release -o /app/build

# Publicar
FROM build AS publish
RUN dotnet publish "TaxProblem.Web.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
EXPOSE 80
EXPOSE 443

# Copiar archivos publicados desde stage anterior
COPY --from=publish /app/publish .

# Variables de entorno por defecto
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD curl -f http://localhost/Products/Index || exit 1

# Comando de inicio
ENTRYPOINT ["dotnet", "TaxProblem.Web.dll"]
