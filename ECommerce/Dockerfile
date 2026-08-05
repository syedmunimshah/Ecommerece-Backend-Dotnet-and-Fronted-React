# Build with the solution root as context:
#   docker build -f ECommerce/Dockerfile -t edgecart-api ECommerce
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project files first so `restore` is cached and only re-runs when a csproj
# changes, rather than on every source edit.
COPY ECommerce/ECommerce.csproj ECommerce/
COPY Service/Service.csproj Service/
COPY Repository/Repository.csproj Repository/
RUN dotnet restore ECommerce/ECommerce.csproj

COPY . .
RUN dotnet publish ECommerce/ECommerce.csproj -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Uploads must not live under the app directory — see LocalFileStorageService. Mount a
# volume here to keep them across container rebuilds.
ENV FileUpload__RootPath=/app/data/uploads
RUN mkdir -p /app/data/uploads

# Non-root, matching how App Service and most orchestrators expect containers to run.
RUN adduser --disabled-password --gecos "" --uid 5678 appuser \
    && chown -R appuser /app
USER appuser

COPY --from=build --chown=appuser /app/publish .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080
ENTRYPOINT ["dotnet", "ECommerce.dll"]
