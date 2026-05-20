# 1. Etapa de construcción
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copiar solo el archivo del proyecto y restaurar dependencias
COPY ["TaxiApp.csproj", "./"]
RUN dotnet restore "TaxiApp.csproj"

# Copiar el resto del código y compilar
COPY . .
RUN dotnet publish "TaxiApp.csproj" -c Release -o /app/publish

# 2. Etapa de ejecución (una imagen más ligera solo para correr la app)
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app/publish .

# Exponer el puerto que usará Render
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

# Comando para arrancar tu app
ENTRYPOINT ["dotnet", "TaxiApp.dll"]