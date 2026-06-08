# Azure Deployment Guide

## Arquitectura

```
                    +-------------------+
                    |   MongoDB Atlas   |
                    +--------+----------+
                             |
          +------------------+------------------+
          |                                     |
+---------v----------+            +-------------v--------+
|   VM 1 (Backend)   |            |   VM 2 (Frontend)    |
|   Port 3017        |            |   Port 8017          |
|   computerstore-api|            |   computerstore-ui   |
+--------------------+            +----------------------+
```

## Requisitos

- [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli)
- [Docker](https://www.docker.com/get-started/)
- [Docker Hub](https://hub.docker.com/) account (gratuita)

## Paso 1: Build y push de imágenes

Editar `deploy/build-and-push.ps1`:

```powershell
$BackendImage = "tudockerhub/computerstore-api:latest"
$FrontendImage = "tudockerhub/computerstore-ui:latest"
```

Ejecutar:

```powershell
.\deploy\build-and-push.ps1
```

## Paso 2: Configurar deploy de Azure

Editar `deploy/deploy-azure.ps1`:

```powershell
$AdminPass = "TuPasswordSegura123!"
$BackendImage = "tudockerhub/computerstore-api:latest"
$FrontendImage = "tudockerhub/computerstore-ui:latest"
```

## Paso 3: Ejecutar deploy

```powershell
.\deploy\deploy-azure.ps1
```

El script tarda ~5-10 minutos. Al final muestra las IPs:

```
Backend API:  http://<IP>:3017/computerstore/customers
Frontend UI:  http://<IP>:8017
```

## Paso 4: Probar

1. Abrir `http://<FRONTEND_IP>:8017` en el navegador
2. Probar CRUD: Load Customers, Create, Edit, Delete, Search by ID
3. Probar API directa: `http://<BACKEND_IP>:3017/computerstore/customers`

## Puertos

| Servicio  | Puerto | VM                  |
|-----------|--------|----------------------|
| Backend   | 3017   | vm-computerstore-api-17 |
| Frontend  | 8017   | vm-computerstore-ui-17  |

Ambos terminan en **17** por número de lista.

## Detener VMs (para ahorrar costos)

```powershell
az vm stop --resource-group computerstore-rg-17 --name vm-computerstore-api-17
az vm stop --resource-group computerstore-rg-17 --name vm-computerstore-ui-17
```

## Eliminar todo

```powershell
az group delete --name computerstore-rg-17 --yes
```
