# Azure Deployment Guide - Masks Inventory API

## Prerequisites

- Azure CLI installed
- Logged in: `az login --use-device-code`

## Deploy Both Services

```powershell
# Create resource group
az group create --name masks-api-rg --location westeurope

# Deploy CRUD service (port 3017)
az webapp up --name masks-crud-api --resource-group masks-api-rg --runtime "NODE:22-lts" --os-type linux --sku B1 --location westeurope
az webapp config set --resource-group masks-api-rg --name masks-crud-api --startup-file "node crud/index.js"

# Deploy Business Logic service (port 3018)
az webapp up --name masks-business-api --resource-group masks-api-rg --runtime "NODE:22-lts" --os-type linux --sku B1 --location westeurope
az webapp config set --resource-group masks-api-rg --name masks-business-api --startup-file "node businessLogic/index.js"
```

## Redeploy After Code Changes

```powershell
# CRUD service
az webapp up --name masks-crud-api --resource-group masks-api-rg --runtime "NODE:22-lts" --os-type linux --sku B1 --location westeurope

# Business Logic service
az webapp up --name masks-business-api --resource-group masks-api-rg --runtime "NODE:22-lts" --os-type linux --sku B1 --location westeurope
```

Or using zip deploy:

```powershell
Compress-Archive -Path ".\crud", ".\businessLogic", ".\package.json", ".\package-lock.json", ".\.gitignore" -DestinationPath "deploy.zip" -Force
az webapp deploy --resource-group masks-api-rg --name masks-crud-api --src-path deploy.zip --type zip --restart true
az webapp deploy --resource-group masks-api-rg --name masks-business-api --src-path deploy.zip --type zip --restart true
```

## Service URLs

| Service | URL |
|---------|-----|
| CRUD API | `https://masks-crud-api.azurewebsites.net` |
| Business Logic API | `https://masks-business-api.azurewebsites.net` |

## Endpoints

### CRUD Service (`/api/masks`)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/masks` | Read all masks |
| GET | `/api/masks/:id` | Read mask by ID |
| POST | `/api/masks` | Create mask |
| PUT | `/api/masks/:id` | Update mask |
| DELETE | `/api/masks/:id` | Delete mask |

### Business Logic Service (`/api/masks`)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/masks/total-units` | Sum of all mask units |

## Useful Commands

```powershell
# View logs
az webapp log tail --resource-group masks-api-rg --name masks-crud-api --provider application
az webapp log tail --resource-group masks-api-rg --name masks-business-api --provider application

# Restart
az webapp restart --resource-group masks-api-rg --name masks-crud-api
az webapp restart --resource-group masks-api-rg --name masks-business-api

# Download logs
az webapp log download --resource-group masks-api-rg --name masks-crud-api --log-file logs.zip
az webapp log download --resource-group masks-api-rg --name masks-business-api --log-file logs.zip

# Delete resources
az group delete --name masks-api-rg --yes --no-wait
```
