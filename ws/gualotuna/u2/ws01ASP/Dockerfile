# Use the official .NET 8 SDK image to build the app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore as distinct layers
COPY ["GestionNominaMVC.csproj", "./"]
RUN dotnet restore "GestionNominaMVC.csproj"

# Copy everything else and build the app
COPY . .
RUN dotnet publish "GestionNominaMVC.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Use the official ASP.NET Core runtime image to run the app
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Expose port 8080 (the default for .NET 8 in Docker)
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "GestionNominaMVC.dll"]
