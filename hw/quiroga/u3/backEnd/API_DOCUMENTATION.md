# Documentación Técnica de APIs (Endpoints)
## Proyecto de Facturación Electrónica y Generación de ATS
**Autor:** Desarrollador Backend Senior & Documentador Técnico de Software  
**Fecha de Revisión:** 12 de Junio de 2026  
**Servicios Documentados:**
1. **Servicio de Reglas de Negocio (ats-business-rules)** - Puerto `3001`
2. **Servicio CRUD (ats-crud)** - Puerto `3000`

---

## Índice de Contenidos
- [Servicio de Reglas de Negocio (ats-business-rules)](#servicio-de-reglas-de-negocio-ats-business-rules)
  - [GET /health](#get-health)
  - [POST /business/generate-csv](#post-businessgenerate-csv)
  - [POST /business/validate-csv](#post-businessvalidate-csv)
  - [POST /business/convert-xml](#post-businessconvert-xml)
- [Servicio CRUD (ats-crud)](#servicio-crud-ats-crud)
  - [Módulo: Usuarios (Users)](#módulo-usuarios-users)
    - [GET /users/](#get-users)
    - [GET /users/:id](#get-usersid)
    - [POST /users/register](#post-usersregister)
    - [POST /users/login](#post-userslogin)
    - [POST /users/login/google](#post-userslogingoogle)
    - [POST /users/complete-profile](#post-userscomplete-profile)
    - [POST /users/reset-password](#post-usersreset-password)
  - [Módulo: Contribuyentes (Taxpayers)](#módulo-contribuyentes-taxpayers)
    - [GET /taxpayer/profile/:userId](#get-taxpayerprofileuserid)
    - [GET /taxpayer/stats/:userId](#get-taxpayerstatsuserid)
    - [GET /taxpayer/validate-ruc/:ruc](#get-taxpayervalidate-rucruc)
    - [PUT /taxpayer/profile/:userId](#put-taxpayerprofileuserid)
  - [Módulo: SRI Connection](#módulo-sri-connection)
    - [GET /sri/status/:userId](#get-sristatususerid)
    - [GET /sri/history/:userId](#get-srihistoryuserid)
    - [POST /sri/connect](#post-sriconnect)
  - [Módulo: Áreas de Trabajo (Workspaces)](#módulo-áreas-de-trabajo-workspaces)
    - [GET /workspaces/user/:userId](#get-workspacesuseruserid)
    - [GET /workspaces/:workspaceId](#get-workspacesworkspaceid)
    - [POST /workspaces/](#post-workspaces)
    - [GET /workspaces/:workspaceId/invoices](#get-workspacesworkspaceidinvoices)
    - [GET /workspaces/:workspaceId/ats](#get-workspacesworkspaceidats)
    - [GET /workspaces/:workspaceId/summary](#get-workspacesworkspaceidsummary)
    - [GET /workspaces/:workspaceId/process-status](#get-workspacesworkspaceidprocess-status)
    - [GET /workspaces/:workspaceId/process-steps](#get-workspacesworkspaceidprocess-steps)
    - [GET /workspaces/:workspaceId/invoices/export](#get-workspacesworkspaceidinvoicesexport)
    - [POST /workspaces/:workspaceId/invoices/download](#post-workspacesworkspaceidinvoicesdownload)
    - [GET /workspaces/:workspaceId/ats/download-xml](#get-workspacesworkspaceidatsdownload-xml)
    - [GET /workspaces/:workspaceId/ats/download-xlsm](#get-workspacesworkspaceidatsdownload-xlsm)
    - [POST /workspaces/:workspaceId/ats/generate](#post-workspacesworkspaceidatsgenerate)
    - [GET /workspaces/:workspaceId/logs](#get-workspacesworkspaceidlogs)
    - [DELETE /workspaces/:workspaceId](#delete-workspacesworkspaceid)
  - [Módulo: Facturas (Invoices)](#módulo-facturas-invoices)
    - [GET /invoices/user/:userId](#get-invoicesuseruserid)
    - [GET /invoices/download/:ruc](#get-invoicesdownloadruc)
    - [POST /invoices/user/:userId](#post-invoicesuseruserid)
    - [GET /invoices/user/:userId/summary](#get-invoicesuseruseridsummary)
  - [Módulo: ATS Anexos (ATS)](#módulo-ats-anexos-ats)
    - [GET /ats/user/:userId](#get-atsuseruserid)
    - [POST /ats/user/:userId](#post-atsuseruserid)
    - [GET /ats/user/:userId/export-csv](#get-atsuseruseridexport-csv)
    - [POST /ats/user/:userId/validate-csv](#post-atsuseruseridvalidate-csv)
    - [POST /ats/user/:userId/convert-xml](#post-atsuseruseridconvert-xml)
  - [Módulo: Trazabilidad y Auditoría (Traceability)](#módulo-trazabilidad-y-auditoría-traceability)
    - [GET /traceability/audit](#get-traceabilityaudit)
    - [POST /traceability/audit](#post-traceabilityaudit)
    - [GET /traceability/process/:userId](#get-traceabilityprocessuserid)
    - [PUT /traceability/process/:stepId](#put-traceabilityprocessstepid)
- [Módulos Declarados Adicionales (Sin montar en servidor principal)](#módulos-declarados-adicionales-sin-montar-en-servidor-principal)
  - [Módulo: Administración (Admin)](#módulo-administración-admin)
  - [Módulo: Soporte Técnico (Support)](#módulo-soporte-técnico-support)

---

# Servicio de Reglas de Negocio (ats-business-rules)

Este servicio encapsula toda la lógica de validación de datos tributarios, procesamiento matemático de facturas emitidas/recibidas, conversión de formatos (CSV a XML) y estructuración física del Anexo Transaccional Simplificado (ATS) sin interacción directa con base de datos.

### ats-business-rules - General

#### `GET` /health
* **Descripción:** Realiza un diagnóstico rápido de disponibilidad del servicio de reglas de negocio. Pertenece a la lógica operativa básica.
* **Autenticación / Permisos:** Público (Ninguno).
* **Parámetros de Petición (Request):**
  * *Headers:* Ninguno.
  * *Query Params / Path Params:* Ninguno.
  * *Body (JSON):* Ninguno.
* **Respuestas del Servidor (Responses):**
  * **`HTTP 200` (Éxito):**
    ```json
    {
      "status": "OK",
      "service": "Business Rules Service",
      "timestamp": "2026-06-11T21:25:53.000Z"
    }
    ```
  * **`HTTP 503 / 424` (Simulación de Caída):** Si el servicio de reglas de negocio no está corriendo o tiene una caída de red, el puerto no responderá (ERR_CONNECTION_REFUSED), lo cual causará que el Servicio B active su Circuit Breaker o de devuelva una excepción HTTP 503/424.

---

### ats-business-rules - Procesamiento y Conversión

#### `POST` /business/generate-csv
* **Descripción:** Toma un arreglo de objetos de facturas (invoices) del cuerpo de la petición y genera una estructura plana en formato de texto CSV. Pertenece a la lógica pura de negocio.
* **Autenticación / Permisos:** Público (Ninguno).
* **Parámetros de Petición (Request):**
  * *Headers:* `Content-Type: application/json`
  * *Body (JSON):*
    ```json
    {
      "invoices": [
        {
          "id": "1",
          "type": "COMPRA",
          "number": "001-001-000000001",
          "issuerName": "EMPRESA PROVEEDORA S.A.",
          "issuerCommercialName": "PROVEEDOR",
          "issuerAddress": "Av. Amazonas, Quito",
          "issuerRuc": "1790011223001",
          "customerDate": "2026-06-11",
          "authorizationNumber": "1106202601179001122300120010010000000011234567813",
          "emissionType": "Normal",
          "accessKey": "1106202601179001122300120010010000000011234567813",
          "customerName": "JUAN PEREZ",
          "customerId": "1720000001",
          "customerAddress": "Cumbayá",
          "customerPhone": "0999999999",
          "customerEmail": "juan.perez@example.com",
          "subtotal": 100.00,
          "iva": 15.00,
          "total": 115.00,
          "products": "[{\"code\":\"P1\",\"description\":\"Servicio de soporte\",\"quantity\":1,\"unitPrice\":100,\"total\":100}]"
        }
      ]
    }
    ```
* **Respuestas del Servidor (Responses):**
  * **`HTTP 200` (Éxito):** Retorna el string con el formato CSV.
    ```json
    {
      "success": true,
      "csvContent": "id,type,number,issuerName,issuerCommercialName,issuerAddress,issuerRuc,customerDate,authorizationNumber,emissionType,accessKey,customerName,customerId,customerAddress,customerPhone,customerEmail,subtotal,iva,total,products\n1,COMPRA,001-001-000000001,EMPRESA PROVEEDORA S.A.,PROVEEDOR,\"Av. Amazonas, Quito\",1790011223001,2026-06-11,1106202601179001122300120010010000000011234567813,Normal,1106202601179001122300120010010000000011234567813,JUAN PEREZ,1720000001,Cumbayá,0999999999,juan.perez@example.com,100,15,115,\"[{\\\"code\\\":\\\"P1\\\",\\\"description\\\":\\\"Servicio de soporte\\\",\\\"quantity\\\":1,\\\"unitPrice\\\":100,\\\"total\\\":100}]\""
    }
    ```
  * **`HTTP 400` (Error de validación):**
    ```json
    {
      "success": false,
      "message": "invoices array is required"
    }
    ```
  * **`HTTP 500` (Error Interno):**
    ```json
    {
      "success": false,
      "message": "Mensaje detallado del error de sistema"
    }
    ```

#### `POST` /business/validate-csv
* **Descripción:** Analiza y valida la integridad de un archivo CSV de facturas. Verifica que la suma de `subtotal` + `iva` coincida con el `total` (tolerancia de $0.05) y calcula totales acumulados de Compras, Ventas y Globales. Lógica de negocio pura.
* **Autenticación / Permisos:** Público (Ninguno).
* **Parámetros de Petición (Request):**
  * *Headers:* `Content-Type: application/json`
  * *Body (JSON):*
    ```json
    {
      "csvContent": "id,type,number,issuerName,issuerCommercialName,issuerAddress,issuerRuc,customerDate,authorizationNumber,emissionType,accessKey,customerName,customerId,customerAddress,customerPhone,customerEmail,subtotal,iva,total,products\n1,COMPRA,001-001-000000001,EMPRESA PROVEEDORA S.A.,PROVEEDOR,\"Av. Amazonas, Quito\",1790011223001,2026-06-11,1106202601179001122300120010010000000011234567813,Normal,1106202601179001122300120010010000000011234567813,JUAN PEREZ,1720000001,Cumbayá,0999999999,juan.perez@example.com,100,15,115,"
    }
    ```
* **Respuestas del Servidor (Responses):**
  * **`HTTP 200` (Éxito):**
    ```json
    {
      "success": true,
      "data": {
        "isValid": true,
        "invoiceCount": 1,
        "totals": {
          "sales": {
            "subtotal": 0,
            "iva": 0,
            "total": 0
          },
          "expenses": {
            "subtotal": 100,
            "iva": 15,
            "total": 115
          },
          "global": {
            "subtotal": 100,
            "iva": 15,
            "total": 115
          }
        },
        "errors": []
      }
    }
    ```
  * **`HTTP 400` (Errores de Entrada):**
    ```json
    {
      "success": false,
      "message": "csvContent string is required"
    }
    ```
    O si el CSV está vacío:
    ```json
    {
      "success": false,
      "message": "CSV content is empty"
    }
    ```
  * **`HTTP 200` (Con Errores de Validación Internos):**
    ```json
    {
      "success": true,
      "data": {
        "isValid": false,
        "invoiceCount": 1,
        "totals": { ... },
        "errors": [
          "Fila 2 (001-001-000000001): La suma de subtotal (100) + IVA (12) no coincide con el total (115). Dif: 3.00",
          "Fila 2: Falta el RUC del emisor."
        ]
      }
    }
    ```

#### `POST` /business/convert-xml
* **Descripción:** Toma el contenido CSV plano y lo parsea para retornar un XML con la estructura legal requerida para el ATS (Anexo Transaccional Simplificado). Lógica de negocio pura.
* **Autenticación / Permisos:** Público (Ninguno).
* **Parámetros de Petición (Request):**
  * *Headers:* `Content-Type: application/json`
  * *Body (JSON):*
    ```json
    {
      "csvContent": "id,type,number,issuerName,issuerCommercialName,issuerAddress,issuerRuc,customerDate,authorizationNumber,emissionType,accessKey,customerName,customerId,customerAddress,customerPhone,customerEmail,subtotal,iva,total,products\n1,COMPRA,001-001-000000001,EMPRESA PROVEEDORA S.A.,PROVEEDOR,\"Av. Amazonas, Quito\",1790011223001,2026-06-11,1106202601179001122300120010010000000011234567813,Normal,1106202601179001122300120010010000000011234567813,JUAN PEREZ,1720000001,Cumbayá,0999999999,juan.perez@example.com,100.00,15.00,115.00,"
    }
    ```
* **Respuestas del Servidor (Responses):**
  * **`HTTP 200` (Éxito):** Retorna el string XML estructurado.
    ```json
    {
      "success": true,
      "xmlContent": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<ats>\n  <invoices>\n    <invoice>\n      <id>1</id>\n      <type>COMPRA</type>\n      <number>001-001-000000001</number>\n      <date>2026-06-11</date>\n      <issuer>\n        <name>EMPRESA PROVEEDORA S.A.</name>\n        <tradeName>PROVEEDOR</tradeName>\n        <address>Av. Amazonas, Quito</address>\n        <ruc>1790011223001</ruc>\n      </issuer>\n      <authorizationNumber>1106202601179001122300120010010000000011234567813</authorizationNumber>\n      <emissionType>Normal</emissionType>\n      <accessKey>1106202601179001122300120010010000000011234567813</accessKey>\n      <client>\n        <name>JUAN PEREZ</name>\n        <identification>1720000001</identification>\n        <address>Cumbayá</address>\n        <phone>0999999999</phone>\n        <email>juan.perez@example.com</email>\n      </client>\n      <details>\n      </details>\n      <financials>\n        <subtotal>100.00</subtotal>\n        <iva>15.00</iva>\n        <total>115.00</total>\n      </financials>\n    </invoice>\n  </invoices>\n  <summary>\n    <invoiceCount>1</invoiceCount>\n    <sales>\n      <subtotal>0.00</subtotal>\n      <iva>0.00</iva>\n      <total>0.00</total>\n    </sales>\n    <expenses>\n      <subtotal>100.00</subtotal>\n      <iva>15.00</iva>\n      <total>115.00</total>\n    </expenses>\n  </summary>\n</ats>"
    }
    ```
  * **`HTTP 400` (Falta parámetro):**
    ```json
    {
      "success": false,
      "message": "csvContent string is required"
    }
    ```

---

# Servicio CRUD (ats-crud)

Este servicio es el núcleo de datos del ecosistema. Implementa persistencia sobre PostgreSQL mediante el ORM Prisma, gestionando las sesiones de usuario, almacenamiento físico de facturas, historiales de procesos de sincronización, auditorías y trazabilidad de eventos.

---

### Módulo: Usuarios (Users)

Módulo encargado del registro, inicio de sesión (local y federado con Google) y restauración de contraseñas de contribuyentes.

#### `GET` /users/
* **Descripción:** Recupera la lista completa de usuarios registrados en la base de datos de persistencia.
* **Autenticación / Permisos:** Público (Abierto).
* **Parámetros de Petición (Request):** Ninguno.
* **Respuestas del Servidor (Responses):**
  * **`HTTP 200` (Éxito):**
    ```json
    {
      "success": true,
      "data": [
        {
          "id": "10ab87c1-df98-4c12-9844-0c58a1bd281f",
          "ruc": "1790011223002",
          "firstName": "Esteban",
          "lastName": "Quiroga",
          "email": "esteban.quiroga@example.com",
          "role": "user",
          "createdAt": "2026-06-11T20:00:00.000Z"
        }
      ]
    }
    ```
  * **`HTTP 500` (Error Interno):**
    ```json
    {
      "success": false,
      "message": "Internal server error"
    }
    ```
  * **Tolerancia a Fallos (Servicio A Caído):** Operación normal al 100%. No requiere al Servicio A de Reglas de Negocio.

#### `GET` /users/:id
* **Descripción:** Obtiene los datos detallados de un usuario por su identificador UUID. Persistencia de datos.
* **Autenticación / Permisos:** Público.
* **Parámetros de Petición (Request):**
  * *Path Params:* `id` (string - UUID de usuario).
* **Respuestas del Servidor (Responses):**
  * **`HTTP 200` (Éxito):**
    ```json
    {
      "success": true,
      "data": {
        "id": "10ab87c1-df98-4c12-9844-0c58a1bd281f",
        "ruc": "1790011223002",
        "firstName": "Esteban",
        "lastName": "Quiroga",
        "email": "esteban.quiroga@example.com",
        "role": "user"
      }
    }
    ```
  * **`HTTP 404` (No encontrado):**
    ```json
    {
      "success": false,
      "message": "User not found"
    }
    ```

#### `POST` /users/register
* **Descripción:** Crea un nuevo perfil de usuario en base de datos. Persistencia de datos.
* **Autenticación / Permisos:** Público.
* **Parámetros de Petición (Request):**
  * *Body (JSON):*
    ```json
    {
      "ruc": "1790011223002",
      "firstName": "Esteban",
      "middleName": "Alejandro",
      "lastName": "Quiroga",
      "secondLastName": "Guzman",
      "email": "esteban.quiroga@example.com",
      "password": "mi_clave_segura",
      "birthDate": "1995-03-24"
    }
    ```
* **Respuestas del Servidor (Responses):**
  * **`HTTP 201` (Creado):**
    ```json
    {
      "success": true,
      "data": {
        "id": "10ab87c1-df98-4c12-9844-0c58a1bd281f",
        "ruc": "1790011223002",
        "firstName": "Esteban",
        "email": "esteban.quiroga@example.com",
        "role": "user",
        "profileCompleted": true
      }
    }
    ```
  * **`HTTP 400` (RUC o Email Existente):**
    ```json
    {
      "success": false,
      "message": "User with this RUC already exists"
    }
    ```
    o
    ```json
    {
      "success": false,
      "message": "User with this Email already exists"
    }
    ```

#### `POST` /users/login
* **Descripción:** Valida credenciales e inicia sesión en el sistema. Persistencia de datos.
* **Autenticación / Permisos:** Público.
* **Parámetros de Petición (Request):**
  * *Body (JSON):*
    ```json
    {
      "email": "esteban.quiroga@example.com",
      "password": "mi_clave_segura"
    }
    ```
* **Respuestas del Servidor (Responses):**
  * **`HTTP 200` (Autenticado):** Devuelve la información del usuario logueado (excluyendo el hash del password).
    ```json
    {
      "success": true,
      "data": {
        "id": "10ab87c1-df98-4c12-9844-0c58a1bd281f",
        "ruc": "1790011223002",
        "firstName": "Esteban",
        "lastName": "Quiroga",
        "email": "esteban.quiroga@example.com",
        "role": "user"
      }
    }
    ```
  * **`HTTP 400` (Falta Campos):**
    ```json
    {
      "success": false,
      "message": "Email and password are required"
    }
    ```
  * **`HTTP 401` (No Autorizado):**
    ```json
    {
      "success": false,
      "message": "Invalid credentials"
    }
    ```

#### `POST` /users/login/google
* **Descripción:** Autentica a un usuario utilizando el Identity Provider de Google (OAuth 2.0). Si el perfil del usuario no cuenta con un RUC asignado en el sistema, indica que se requiere completar el perfil. Persistencia.
* **Autenticación / Permisos:** Público (Usa el token credential entregado por la API de Google).
* **Parámetros de Petición (Request):**
  * *Body (JSON):*
    ```json
    {
      "credential": "eyJhbGciOiJSUzI1NiIsImtpZCI6..."
    }
    ```
* **Respuestas del Servidor (Responses):**
  * **`HTTP 200` (Éxito - Requiere completar RUC):**
    ```json
    {
      "success": true,
      "data": {
        "email": "esteban.quiroga@example.com",
        "firstName": "Esteban",
        "lastName": "Quiroga",
        "ruc": ""
      },
      "needsProfileCompletion": true
    }
    ```
  * **`HTTP 200` (Éxito - Autenticado completamente):**
    ```json
    {
      "success": true,
      "data": {
        "id": "10ab87c1-df98-4c12-9844-0c58a1bd281f",
        "ruc": "1790011223002",
        "firstName": "Esteban",
        "email": "esteban.quiroga@example.com",
        "profileCompleted": true
      },
      "needsProfileCompletion": false
    }
    ```
  * **`HTTP 400` (Token Faltante o Inválido):**
    ```json
    {
      "success": false,
      "message": "Token is required"
    }
    ```

#### `POST` /users/complete-profile
* **Descripción:** Asocia el RUC y los nombres restantes de un contribuyente logueado mediante Google OAuth. Persistencia de datos.
* **Autenticación / Permisos:** Público.
* **Parámetros de Petición (Request):**
  * *Body (JSON):*
    ```json
    {
      "email": "esteban.quiroga@example.com",
      "ruc": "1790011223002",
      "firstName": "Esteban",
      "middleName": "Alejandro",
      "lastName": "Quiroga",
      "secondLastName": "Guzman",
      "birthDate": "1995-03-24"
    }
    ```
* **Respuestas del Servidor (Responses):**
  * **`HTTP 200` (Éxito):**
    ```json
    {
      "success": true,
      "data": {
        "id": "10ab87c1-df98-4c12-9844-0c58a1bd281f",
        "ruc": "1790011223002",
        "firstName": "Esteban",
        "lastName": "Quiroga",
        "email": "esteban.quiroga@example.com",
        "profileCompleted": true
      }
    }
    ```
  * **`HTTP 400` (Falta RUC o Duplicado):**
    ```json
    {
      "success": false,
      "message": "El RUC ingresado ya está registrado con otra cuenta."
    }
    ```

#### `POST` /users/reset-password
* **Descripción:** Restablece la contraseña local asociada a un correo electrónico. Persistencia.
* **Autenticación / Permisos:** Público.
* **Parámetros de Petición (Request):**
  * *Body (JSON):*
    ```json
    {
      "email": "esteban.quiroga@example.com",
      "newPassword": "nueva_clave_secreta"
    }
    ```
* **Respuestas del Servidor (Responses):**
  * **`HTTP 200` (Éxito):**
    ```json
    {
      "success": true,
      "message": "Password updated successfully"
    }
    ```
  * **`HTTP 404` (No Encontrado):**
    ```json
    {
      "success": false,
      "message": "User not found"
    }
    ```

---

### Módulo: Contribuyentes (Taxpayers)

Gestión de información del perfil del contribuyente, estadísticas tributarias locales y formatos de validación física de RUCs.

#### `GET` /taxpayer/profile/:userId
* **Descripción:** Obtiene los datos fiscales básicos de un usuario contribuyente. Persistencia.
* **Autenticación / Permisos:** Público.
* **Parámetros de Petición (Request):**
  * *Path Params:* `userId` (string).
* **Respuestas del Servidor (Responses):**
  * **`HTTP 200` (Éxito):**
    ```json
    {
      "success": true,
      "data": {
        "id": "10ab87c1-df98-4c12-9844-0c58a1bd281f",
        "ruc": "1790011223002",
        "firstName": "Esteban",
        "lastName": "Quiroga",
        "email": "esteban.quiroga@example.com",
        "role": "user",
        "createdAt": "2026-06-11T20:00:00.000Z"
      }
    }
    ```

#### `GET` /taxpayer/stats/:userId
* **Descripción:** Obtiene la sumatoria estadística de las entidades creadas por el usuario en base de datos. Retorna cantidad de áreas de trabajo, total de facturas guardadas, y la fecha del último evento de sincronización de facturas SRI. Persistencia.
* **Autenticación / Permisos:** Público.
* **Parámetros de Petición (Request):**
  * *Path Params:* `userId` (string).
* **Respuestas del Servidor (Responses):**
  * **`HTTP 200` (Éxito):**
    ```json
    {
      "success": true,
      "data": {
        "workspacesCount": 3,
        "totalInvoices": 124,
        "lastSriSync": "2026-06-11T21:00:00.000Z"
      }
    }
    ```

#### `GET` /taxpayer/validate-ruc/:ruc
* **Descripción:** Valida si un RUC tiene la longitud requerida (13 dígitos) y comprueba si ya está registrado en base de datos.
* **Autenticación / Permisos:** Público.
* **Parámetros de Petición (Request):**
  * *Path Params:* `ruc` (string).
* **Respuestas del Servidor (Responses):**
  * **`HTTP 200` (RUC Válido y Libre):**
    ```json
    {
      "success": true,
      "valid": true,
      "exists": false
    }
    ```
  * **`HTTP 200` (RUC Inválido en longitud):**
    ```json
    {
      "success": true,
      "valid": false,
      "exists": false
    }
    ```

#### `PUT` /taxpayer/profile/:userId
* **Descripción:** Modifica el primer nombre y apellido del contribuyente. Persistencia de datos.
* **Autenticación / Permisos:** Público.
* **Parámetros de Petición (Request):**
  * *Path Params:* `userId` (string).
  * *Body (JSON):*
    ```json
    {
      "firstName": "Esteban",
      "lastName": "Quiroga Guzman"
    }
    ```
* **Respuestas del Servidor (Responses):**
  * **`HTTP 200` (Actualizado):** Retorna el objeto del usuario modificado.

---

### Módulo: SRI Connection

Gestiona la conexión lógica del sistema con el portal en línea del SRI (Servicio de Rentas Internas del Ecuador).

#### `GET` /sri/status/:userId
* **Descripción:** Consulta el estado actual de la autenticación configurada contra el portal SRI. Persistencia.
* **Autenticación / Permisos:** Público.
* **Parámetros de Petición (Request):**
  * *Path Params:* `userId` (string).
* **Respuestas del Servidor (Responses):**
  * **`HTTP 200` (Éxito):**
    ```json
    {
      "success": true,
      "data": {
        "connected": true,
        "connectionStatus": "connected",
        "lastChecked": "2026-06-11T21:00:00.000Z",
        "ruc": "1790011223002"
      }
    }
    ```

#### `GET` /sri/history/:userId
* **Descripción:** Obtiene los logs específicos de eventos de comunicación contra el SRI (descargas, intentos de conexión). Persistencia.
* **Autenticación / Permisos:** Público.
* **Parámetros de Petición (Request):**
  * *Path Params:* `userId` (string).
* **Respuestas del Servidor (Responses):**
  * **`HTTP 200` (Éxito):**
    ```json
    {
      "success": true,
      "data": [
        {
          "id": "e305e552-8703-4f9e-be89-3c726359ea43",
          "action": "INVOICES_DOWNLOAD",
          "module": "Integración SRI",
          "details": "Descargadas 24 facturas del portal SRI",
          "timestamp": "2026-06-11T21:00:00.000Z",
          "userId": "10ab87c1-df98-4c12-9844-0c58a1bd281f"
        }
      ]
    }
    ```

#### `POST` /sri/connect
* **Descripción:** Registra las credenciales del contribuyente para el portal SRI, validando la conexión física.
* **Autenticación / Permisos:** Público.
* **Parámetros de Petición (Request):**
  * *Body (JSON):*
    ```json
    {
      "ruc": "1790011223002",
      "password": "clave_sri_portal",
      "additionalCi": "1720000001"
    }
    ```
* **Respuestas del Servidor (Responses):**
  * **`HTTP 200` (Conectado):**
    ```json
    {
      "success": true,
      "message": "SRI connection established successfully",
      "data": {
        "connected": true
      }
    }
    ```
  * **`HTTP 400` (Campos faltantes):**
    ```json
    {
      "success": false,
      "message": "Missing required credentials"
    }
    ```

---

### Módulo: Áreas de Trabajo (Workspaces)

Gestión de contextos periódicos (mes/año) en los cuales el usuario agrupa facturas electrónicas y genera los archivos ATS correspondientes.

#### `GET` /workspaces/user/:userId
* **Descripción:** Lista todas las áreas de trabajo activas de un contribuyente en particular. Persistencia.
* **Autenticación / Permisos:** Público.
* **Parámetros de Petición (Request):**
  * *Path Params:* `userId` (string).
* **Respuestas del Servidor (Responses):**
  * **`HTTP 200` (Éxito):**
    ```json
    {
      "success": true,
      "data": [
        {
          "id": "ws-5566-7788",
          "name": "Workspace 2026-06",
          "periodMonth": 6,
          "periodYear": 2026,
          "periodType": "monthly",
          "workspaceLocation": "Quito",
          "sriConnectionStatus": "disconnected",
          "userId": "10ab87c1-df98-4c12-9844-0c58a1bd281f",
          "createdAt": "2026-06-11T21:00:00.000Z"
        }
      ]
    }
    ```

#### `GET` /workspaces/:workspaceId
* **Descripción:** Entrega los datos detallados de un workspace.
* **Autenticación / Permisos:** Requiere el Header del usuario para validar pertenencia.
* **Parámetros de Petición (Request):**
  * *Headers:* `x-user-id` (UUID del usuario dueño, opcional).
  * *Path Params:* `workspaceId` (string).
* **Respuestas del Servidor (Responses):**
  * **`HTTP 200` (Éxito):** Retorna el objeto del Workspace.
  * **`HTTP 404` (No Encontrado):**
    ```json
    {
      "success": false,
      "message": "Workspace not found"
    }
    ```

#### `POST` /workspaces/
* **Descripción:** Crea una nueva área de trabajo periódica para un contribuyente.
* **Autenticación / Permisos:** Requiere validar el usuario creador en cabeceras.
* **Parámetros de Petición (Request):**
  * *Headers:* `x-user-id` (UUID del creador, requerido).
  * *Body (JSON):*
    ```json
    {
      "period": "2026-06",
      "workspaceLocation": "Quito"
    }
    ```
* **Respuestas del Servidor (Responses):**
  * **`HTTP 201` (Creado):**
    ```json
    {
      "success": true,
      "data": {
        "id": "ws-5566-7788",
        "name": "Workspace 2026-06",
        "periodYear": 2026,
        "periodMonth": 6,
        "workspaceLocation": "Quito",
        "userId": "10ab87c1-df98-4c12-9844-0c58a1bd281f"
      }
    }
    ```
  * **`HTTP 400` (Datos incompletos):**
    ```json
    {
      "success": false,
      "message": "Missing required fields"
    }
    ```

#### `GET` /workspaces/:workspaceId/invoices
* **Descripción:** Obtiene la lista de facturas asignadas a un workspace. Persistencia de datos.
* **Autenticación / Permisos:** Requiere cabecera de autenticación.
* **Parámetros de Petición (Request):**
  * *Headers:* `x-user-id` (string, requerido).
  * *Path Params:* `workspaceId` (string).
* **Respuestas del Servidor (Responses):**
  * **`HTTP 200` (Éxito):** Arreglo conteniendo facturas.

#### `GET` /workspaces/:workspaceId/ats
* **Descripción:** Lista los archivos de anexo generados históricamente en este workspace. Persistencia de datos.
* **Autenticación / Permisos:** Requiere cabecera de autenticación.
* **Parámetros de Petición (Request):**
  * *Headers:* `x-user-id` (string, requerido).
  * *Path Params:* `workspaceId` (string).
* **Respuestas del Servidor (Responses):**
  * **`HTTP 200` (Éxito):** Arreglo conteniendo metadatos de ATS files.

#### `GET` /workspaces/:workspaceId/summary
* **Descripción:** Devuelve un resumen acumulado (cantidad de facturas, sumas de bases imponibles, IVA, totales y contador de errores ATS) pertenecientes al área de trabajo. Persistencia de datos.
* **Autenticación / Permisos:** Requiere cabecera de autenticación.
* **Parámetros de Petición (Request):**
  * *Headers:* `x-user-id` (string, requerido).
  * *Path Params:* `workspaceId` (string).
* **Respuestas del Servidor (Responses):**
  * **`HTTP 200` (Éxito):**
    ```json
    {
      "success": true,
      "data": {
        "invoiceCount": 24,
        "taxBaseSum": 2400.00,
        "ivaSum": 360.00,
        "totalSum": 2760.00,
        "errorCount": 0
      }
    }
    ```

#### `GET` /workspaces/:workspaceId/process-status
* **Descripción:** Retorna indicadores booleanos que definen el estado general del workflow del workspace (si las facturas se descargaron completas, si se generó el Excel XLSM y el XML ATS). Persistencia.
* **Autenticación / Permisos:** Requiere cabecera de autenticación.
* **Parámetros de Petición (Request):**
  * *Headers:* `x-user-id` (string, requerido).
  * *Path Params:* `workspaceId` (string).
* **Respuestas del Servidor (Responses):**
  * **`HTTP 200` (Éxito):**
    ```json
    {
      "success": true,
      "data": {
        "invoiceDownloadStatus": true,
        "atsXlsmGenerationStatus": false,
        "atsXmlGenerationStatus": false
      }
    }
    ```

#### `GET` /workspaces/:workspaceId/process-steps
* **Descripción:** Lista los pasos estructurados del proceso y su estado individual en este workspace. Persistencia de datos.
* **Autenticación / Permisos:** Requiere cabecera de autenticación.
* **Parámetros de Petición (Request):**
  * *Headers:* `x-user-id` (string, requerido).
  * *Path Params:* `workspaceId` (string).
* **Respuestas del Servidor (Responses):**
  * **`HTTP 200` (Éxito):**
    ```json
    {
      "success": true,
      "data": [
        {
          "id": "step-1",
          "title": "Descargar facturas",
          "description": "Descarga de facturas electrónicas desde SRI",
          "status": "completed",
          "module": "Workspace",
          "completedAt": "2026-06-11T21:05:00.000Z",
          "userId": "userId",
          "workspaceId": "workspaceId"
        }
      ]
    }
    ```

#### `GET` /workspaces/:workspaceId/invoices/export
* **Descripción:** Genera de forma inmediata un flujo binario para la descarga de un archivo ZIP conteniendo los archivos de facturas. Retorna archivo.
* **Autenticación / Permisos:** Público.
* **Parámetros de Petición (Request):**
  * *Path Params:* `workspaceId` (string).
* **Respuestas del Servidor (Responses):**
  * **`HTTP 200` (Éxito):** Flujo binario de descarga (`Content-Type: application/zip`).

#### `POST` /workspaces/:workspaceId/invoices/download
* **Descripción:** Encola una petición asíncrona para iniciar la descarga en segundo plano de las facturas desde el SRI hacia este workspace. Persistencia de datos.
* **Autenticación / Permisos:** Público.
* **Parámetros de Petición (Request):**
  * *Path Params:* `workspaceId` (string).
* **Respuestas del Servidor (Responses):**
  * **`HTTP 202` (Aceptado):**
    ```json
    {
      "success": true,
      "message": "Invoice download triggered",
      "data": {
        "invoiceDownloadStatus": false
      }
    }
    ```

#### `GET` /workspaces/:workspaceId/ats/download-xml
* **Descripción:** Genera un archivo XML estructurado rápido del ATS para descarga inmediata por el navegador. Lógica básica.
* **Autenticación / Permisos:** Requiere cabecera de autenticación.
* **Parámetros de Petición (Request):**
  * *Headers:* `x-user-id` (string, requerido).
  * *Path Params:* `workspaceId` (string).
* **Respuestas del Servidor (Responses):**
  * **`HTTP 200` (Éxito):** Retorna archivo XML (`Content-Type: application/xml`).
    ```xml
    <?xml version="1.0" encoding="UTF-8"?>
    <ats>
      <idInformante>1790011223002</idInformante>
      <workspaceId>ws-uuid</workspaceId>
      <info>Reporte ATS generado para fines academicos</info>
    </ats>
    ```

#### `GET` /workspaces/:workspaceId/ats/download-xlsm
* **Descripción:** Descarga el formato Excel habilitado para macros (.xlsm) para la visualización del ATS localmente.
* **Autenticación / Permisos:** Público.
* **Parámetros de Petición (Request):**
  * *Path Params:* `workspaceId` (string).
* **Respuestas del Servidor (Responses):**
  * **`HTTP 200` (Éxito):** Descarga binaria (`Content-Type: application/vnd.ms-excel.sheet.macroEnabled.12`).

#### `POST` /workspaces/:workspaceId/ats/generate
* **Descripción:** Dispara el proceso asíncrono en segundo plano para consolidar facturas y estructurar el anexo. Persistencia.
* **Autenticación / Permisos:** Público.
* **Parámetros de Petición (Request):**
  * *Path Params:* `workspaceId` (string).
* **Respuestas del Servidor (Responses):**
  * **`HTTP 202` (Aceptado):**
    ```json
    {
      "success": true,
      "message": "ATS generation triggered"
    }
    ```

#### `GET` /workspaces/:workspaceId/logs
* **Descripción:** Obtiene los últimos 50 eventos de auditoría y logs relacionados con operaciones ejecutadas sobre este workspace.
* **Autenticación / Permisos:** Requiere cabecera de autenticación.
* **Parámetros de Petición (Request):**
  * *Headers:* `x-user-id` (string, requerido).
  * *Path Params:* `workspaceId` (string).
* **Respuestas del Servidor (Responses):**
  * **`HTTP 200` (Éxito):** Devuelve arreglo de eventos.

#### `DELETE` /workspaces/:workspaceId
* **Descripción:** Elimina un workspace de la base de datos de persistencia.
* **Autenticación / Permisos:** Público.
* **Parámetros de Petición (Request):**
  * *Path Params:* `workspaceId` (string).
* **Respuestas del Servidor (Responses):**
  * **`HTTP 200` (Éxito):**
    ```json
    {
      "success": true,
      "message": "Workspace deleted successfully"
    }
    ```

---

### Módulo: Facturas (Invoices)

Persistencia de facturas emitidas y recibidas. Todas las rutas de este módulo requieren tokens de sesión/usuario.

#### `GET` /invoices/user/:userId
* **Descripción:** Obtiene todas las facturas asociadas a un contribuyente específico. Persistencia de datos.
* **Autenticación / Permisos:** Requiere token/cabecera de autenticación.
* **Parámetros de Petición (Request):**
  * *Headers:* `x-user-id` (string - UUID de usuario requerido por `authMiddleware`).
  * *Path Params:* `userId` (string).
* **Respuestas del Servidor (Responses):**
  * **`HTTP 200` (Éxito):**
    ```json
    {
      "success": true,
      "data": [
        {
          "id": "inv-f20387b3",
          "issuerName": "CORPORACION FAVORITA S.A.",
          "issuerCommercialName": "Supermaxi",
          "issuerAddress": "Av. Eloy Alfaro, Quito",
          "issuerRuc": "1790016919001",
          "number": "001-010-000234567",
          "authorizationNumber": "1106202601179001691900120010100002345671234567812",
          "emissionType": "Normal",
          "accessKey": "1106202601179001691900120010100002345671234567812",
          "customerName": "JUAN PEREZ",
          "customerId": "1720000001",
          "customerDate": "2026-06-11",
          "subtotal": 50.00,
          "iva": 7.50,
          "total": 57.50,
          "type": "COMPRA",
          "format": "XML",
          "userId": "10ab87c1-df98-4c12-9844-0c58a1bd281f",
          "workspaceId": "ws-5566-7788",
          "createdAt": "2026-06-11T21:00:00.000Z"
        }
      ]
    }
    ```
  * **`HTTP 401` (Falta Autenticación):**
    ```json
    {
      "success": false,
      "message": "Missing authentication header"
    }
    ```

#### `GET` /invoices/download/:ruc
* **Descripción:** Descarga facturas filtradas asociadas a un RUC del contribuyente. Permite filtrar por tipo de periodo, mes, semestre y año de emisión. Persistencia.
* **Autenticación / Permisos:** Requiere token/cabecera.
* **Parámetros de Petición (Request):**
  * *Headers:* `x-user-id` (string, requerido).
  * *Path Params:* `ruc` (string).
  * *Query Params:*
    * `periodType` (string: "monthly" | "semi-annual", requerido si se desea filtrar)
    * `year` (string/number, año de consulta)
    * `month` (string/number, mes 01-12)
    * `semester` (string/number: "1" | "2")
* **Respuestas del Servidor (Responses):**
  * **`HTTP 200` (Éxito):**
    ```json
    {
      "success": true,
      "data": [
        {
          "id": "inv-f20387b3",
          "issuerName": "TIENDAS INDUSTRIALES ASOCIADAS TIA",
          "issuerCommercialName": "TIA",
          "issuerAddress": "Guayaquil",
          "issuerRuc": "0990017122001",
          "number": "002-005-000342111",
          "authorizationNumber": "1106202601099001712200120020050003421111234567814",
          "emissionType": "Normal",
          "accessKey": "1106202601099001712200120020050003421111234567814",
          "customerName": "TEST USER",
          "customerId": "0930210763001",
          "customerDate": "2026-06-11",
          "subtotal": 10.0,
          "iva": 1.5,
          "total": 11.5,
          "type": "COMPRA",
          "format": "XML",
          "userId": "10ab87c1-df98-4c12-9844-0c58a1bd281f",
          "workspaceId": "ws-5566-7788",
          "createdAt": "2026-06-11T21:00:00.000Z"
        }
      ]
    }
    ```
  * **`HTTP 400` (Parámetros Inválidos):**
    ```json
    {
      "success": false,
      "message": "RUC is required"
    }
    ```

#### `POST` /invoices/user/:userId
* **Descripción:** Guarda un conjunto de facturas nuevas en lote en la base de datos de persistencia.
* **Autenticación / Permisos:** Requiere token/cabecera.
* **Parámetros de Petición (Request):**
  * *Headers:* `x-user-id` (string, requerido).
  * *Path Params:* `userId` (string).
  * *Body (JSON):*
    ```json
    {
      "invoices": [
        {
          "issuerName": "TIENDAS INDUSTRIALES ASOCIADAS TIA",
          "issuerRuc": "0990017122001",
          "number": "002-005-000342111",
          "authorizationNumber": "1106202601099001712200120020050003421111234567814",
          "accessKey": "1106202601099001712200120020050003421111234567814",
          "customerName": "JUAN PEREZ",
          "customerId": "1720000001",
          "customerDate": "2026-06-11",
          "subtotal": 10.00,
          "iva": 1.50,
          "total": 11.50,
          "type": "COMPRA",
          "format": "XML",
          "workspaceId": "ws-5566-7788",
          "products": []
        }
      ]
    }
    ```
* **Respuestas del Servidor (Responses):**
  * **`HTTP 201` (Creado):** Arreglo de facturas guardadas.
  * **`HTTP 400` (Formato Inválido):**
    ```json
    {
      "success": false,
      "message": "Invalid data format"
    }
    ```

#### `GET` /invoices/user/:userId/summary
* **Descripción:** Obtiene un resumen consolidado totalizado del usuario de todas sus facturas registradas en la base de datos (conteo de registros, sumas netas agrupadas por Compras y Ventas). Persistencia.
* **Autenticación / Permisos:** Requiere token/cabecera.
* **Parámetros de Petición (Request):**
  * *Headers:* `x-user-id` (string, requerido).
  * *Path Params:* `userId` (string).
* **Respuestas del Servidor (Responses):**
  * **`HTTP 200` (Éxito):**
    ```json
    {
      "success": true,
      "data": {
        "sales": { "count": 2, "subtotal": 1200.00, "iva": 180.00, "total": 1380.00 },
        "expenses": { "count": 8, "subtotal": 2400.00, "iva": 360.00, "total": 2760.00 },
        "global": { "count": 10, "subtotal": 3600.00, "iva": 540.00, "total": 4140.00 }
      }
    }
    ```

---

### Módulo: ATS Anexos (ATS)

Módulo puente clave que coordina los datos guardados en base de datos local (Servicio B) y llama al motor de cálculo y lógica tributaria (Servicio A) usando disyuntores de circuito (Circuit Breakers) con Opossum.

#### `GET` /ats/user/:userId
* **Descripción:** Lista los metadatos de los archivos ATS generados guardados del contribuyente. Persistencia.
* **Autenticación / Permisos:** Requiere token/cabecera.
* **Parámetros de Petición (Request):**
  * *Headers:* `x-user-id` (string, requerido).
  * *Path Params:* `userId` (string).
* **Respuestas del Servidor (Responses):**
  * **`HTTP 200` (Éxito):** Lista de metadatos de ATS files.

#### `POST` /ats/user/:userId
* **Descripción:** Registra en base de datos local un nuevo metadato/historial de archivo ATS generado. Persistencia.
* **Autenticación / Permisos:** Requiere token/cabecera.
* **Parámetros de Petición (Request):**
  * *Headers:* `x-user-id` (string, requerido).
  * *Path Params:* `userId` (string).
  * *Body (JSON):*
    ```json
    {
      "name": "ATS_1790011223002_06_2026.xml",
      "format": "XML",
      "periodMonth": 6,
      "periodYear": 2026,
      "invoiceCount": 24,
      "validationErrors": 0,
      "workspaceId": "ws-5566-7788"
    }
    ```
* **Respuestas del Servidor (Responses):**
  * **`HTTP 201` (Creado):** Retorna el registro insertado.

#### `GET` /ats/user/:userId/export-csv
* **Descripción:** Busca las facturas del usuario en base de datos local y llama al Servicio de Reglas de Negocio (Servicio A) para transformarlos a un CSV estructurado de facturas.
* **Autenticación / Permisos:** Requiere token/cabecera.
* **Parámetros de Petición (Request):**
  * *Headers:* `x-user-id` (string, requerido).
  * *Path Params:* `userId` (string).
* **Respuestas del Servidor (Responses):**
  * **`HTTP 200` (Éxito):** Retorna un archivo de texto CSV para descarga directa del cliente.
    * *Headers:*
      * `Content-Type: text/csv`
      * `Content-Disposition: attachment; filename=invoices_{userId}.csv`
  * **`HTTP 503` (Simulación de Caída - Circuit Breaker Activado):**
    Si el Servicio A de Reglas de Negocio llega a estar caído, se activa el Circuit Breaker de Opossum (después de 3 segundos de timeout, o por tasa de fallos > 50%), intercepta el error de red, y devuelve de forma controlada el siguiente JSON con tolerancia a fallos:
    ```json
    {
      "isFallback": true,
      "message": "El Servicio de Reglas de Negocio (Servicio A) no está disponible temporalmente. Las funciones básicas de CRUD (Servicio B) siguen operativas.",
      "error": "request to http://localhost:3001/business/generate-csv failed, reason: connect ECONNREFUSED"
    }
    ```

#### `POST` /ats/user/:userId/validate-csv
* **Descripción:** Recibe el contenido plano de un CSV y llama al Servicio de Reglas de Negocio (Servicio A) para realizar auditoría matemática de sumatorias y base imponible.
* **Autenticación / Permisos:** Requiere token/cabecera.
* **Parámetros de Petición (Request):**
  * *Headers:* `x-user-id` (string, requerido).
  * *Path Params:* `userId` (string).
  * *Body (JSON):*
    ```json
    {
      "csvContent": "id,type,number,issuerName,issuerCommercialName,issuerAddress,issuerRuc,customerDate,authorizationNumber,emissionType,accessKey,customerName,customerId,customerAddress,customerPhone,customerEmail,subtotal,iva,total,products\n1,COMPRA,001-001-000000001,EMPRESA PROVEEDORA S.A.,PROVEEDOR,\"Av. Amazonas, Quito\",1790011223001,2026-06-11,1106202601179001122300120010010000000011234567813,Normal,1106202601179001122300120010010000000011234567813,JUAN PEREZ,1720000001,Cumbayá,0999999999,juan.perez@example.com,100.00,15.00,115.00,"
    }
    ```
* **Respuestas del Servidor (Responses):**
  * **`HTTP 200` (Éxito):**
    ```json
    {
      "success": true,
      "data": {
        "isValid": true,
        "invoiceCount": 1,
        "totals": {
          "sales": { "subtotal": 0, "iva": 0, "total": 0 },
          "expenses": { "subtotal": 100, "iva": 15, "total": 115 },
          "global": { "subtotal": 100, "iva": 15, "total": 115 }
        },
        "errors": []
      }
    }
    ```
  * **`HTTP 400` (Parámetros inválidos):**
    ```json
    {
      "success": false,
      "message": "csvContent is required as string"
    }
    ```
  * **`HTTP 503` (Simulación de Caída - Circuit Breaker Activado):**
    Si el Servicio A de Reglas de Negocio está caído o experimenta lag superior al timeout, Opossum activa el disyuntor devolviendo de forma inmediata (sin sobrecargar al sistema):
    ```json
    {
      "isFallback": true,
      "message": "El Servicio de Reglas de Negocio (Servicio A) no está disponible temporalmente. Las funciones básicas de CRUD (Servicio B) siguen operativas.",
      "error": "request to http://localhost:3001/business/validate-csv failed, reason: connect ECONNREFUSED"
    }
    ```

#### `POST` /ats/user/:userId/convert-xml
* **Descripción:** Envía el CSV parseado en local al Servicio de Reglas de Negocio (Servicio A) para convertirlo a la estructura final de XML ATS.
* **Autenticación / Permisos:** Requiere token/cabecera.
* **Parámetros de Petición (Request):**
  * *Headers:* `x-user-id` (string, requerido).
  * *Path Params:* `userId` (string).
  * *Body (JSON):*
    ```json
    {
      "csvContent": "id,type,number,issuerName,issuerCommercialName,issuerAddress,issuerRuc,customerDate,authorizationNumber,emissionType,accessKey,customerName,customerId,customerAddress,customerPhone,customerEmail,subtotal,iva,total,products\n1,COMPRA,001-001-000000001,EMPRESA PROVEEDORA S.A.,PROVEEDOR,\"Av. Amazonas, Quito\",1790011223001,2026-06-11,1106202601179001122300120010010000000011234567813,Normal,1106202601179001122300120010010000000011234567813,JUAN PEREZ,1720000001,Cumbayá,0999999999,juan.perez@example.com,100.00,15.00,115.00,"
    }
    ```
* **Respuestas del Servidor (Responses):**
  * **`HTTP 200` (Éxito):** Retorna el XML.
    * *Headers:*
      * `Content-Type: application/xml`
  * **`HTTP 503` (Simulación de Caída - Circuit Breaker Activado):**
    ```json
    {
      "isFallback": true,
      "message": "El Servicio de Reglas de Negocio (Servicio A) no está disponible temporalmente. Las funciones básicas de CRUD (Servicio B) siguen operativas.",
      "error": "request to http://localhost:3001/business/convert-xml failed, reason: connect ECONNREFUSED"
    }
    ```

---

### Módulo: Trazabilidad y Auditoría (Traceability)

Registra y rastrea las acciones realizadas por los usuarios y los estados de procesamiento dentro del sistema, garantizando cumplimiento regulatorio e inmutabilidad de logs de auditoría.

#### `GET` /traceability/audit
* **Descripción:** Lista los eventos globales de auditoría registrados en el sistema. Persistencia.
* **Autenticación / Permisos:** Requiere token/cabecera.
* **Parámetros de Petición (Request):**
  * *Headers:* `x-user-id` (string, requerido).
* **Respuestas del Servidor (Responses):**
  * **`HTTP 200` (Éxito):**
    ```json
    {
      "success": true,
      "data": [
        {
          "id": "ae-9988-2233",
          "action": "USER_LOGIN",
          "module": "Auth",
          "details": "Sesión iniciada con éxito por Google OAuth",
          "timestamp": "2026-06-11T21:00:00.000Z",
          "userId": "10ab87c1-df98-4c12-9844-0c58a1bd281f"
        }
      ]
    }
    ```

#### `POST` /traceability/audit
* **Descripción:** Registra un nuevo evento en el histórico de auditoría del sistema. Persistencia.
* **Autenticación / Permisos:** Requiere token/cabecera.
* **Parámetros de Petición (Request):**
  * *Headers:* `x-user-id` (string, requerido).
  * *Body (JSON):*
    ```json
    {
      "action": "ATS_EXPORT",
      "module": "ATS",
      "details": "Exportado ATS XML del periodo 2026-06",
      "userId": "10ab87c1-df98-4c12-9844-0c58a1bd281f"
    }
    ```
* **Respuestas del Servidor (Responses):**
  * **`HTTP 201` (Creado):** Retorna el objeto del evento insertado.

#### `GET` /traceability/process/:userId
* **Descripción:** Recupera la lista de todos los pasos de flujo y tareas asociadas a los workflows de un usuario. Persistencia.
* **Autenticación / Permisos:** Requiere token/cabecera.
* **Parámetros de Petición (Request):**
  * *Headers:* `x-user-id` (string, requerido).
  * *Path Params:* `userId` (string).
* **Respuestas del Servidor (Responses):**
  * **`HTTP 200` (Éxito):** Arreglo conteniendo objetos de estados de procesos.

#### `PUT` /traceability/process/:stepId
* **Descripción:** Actualiza el estado actual (e.g. de "pending" a "completed") de una tarea o paso en particular del workflow. Persistencia.
* **Autenticación / Permisos:** Requiere token/cabecera.
* **Parámetros de Petición (Request):**
  * *Headers:* `x-user-id` (string, requerido).
  * *Path Params:* `stepId` (string).
  * *Body (JSON):*
    ```json
    {
      "status": "completed"
    }
    ```
* **Respuestas del Servidor (Responses):**
  * **`HTTP 200` (Éxito):** Retorna el objeto del paso actualizado con la marca temporal en `completedAt`.

---

# Módulos Declarados Adicionales (Sin montar en servidor principal)

Los siguientes módulos e interfaces de controladores y enrutamiento se encuentran completamente programados en el repositorio (`admin.routes.ts` y `support.routes.ts`), pero en la versión actual de la clase `App` en `app.ts` no se han mapeado sus endpoints en Express. Se documentan aquí para auditoría y desarrollo futuro.

---

### Módulo: Administración (Admin)

Gestión global de usuarios de la plataforma, tickets de soporte generales, auditorías extendidas y configuraciones técnicas del sistema.

* **Prefijo base propuesto:** `/admin`
* **Enrutador:** [admin.routes.ts](file:///c:/Users/Angel%20Sabando/OneDrive/Documentos/workspace/ESPE2604-AWD30716-DEA/06Code/backEnd/src/routes/admin.routes.ts)
* **Controlador:** [admin.controller.ts](file:///c:/Users/Angel%20Sabando/OneDrive/Documentos/workspace/ESPE2604-AWD30716-DEA/06Code/backEnd/src/controllers/admin.controller.ts)
* **Autenticación / Permisos:** Requiere cabecera de autenticación (`authMiddleware`).

#### `GET` /admin/users
* **Descripción:** Obtiene un listado completo y resumido de todos los usuarios registrados en el sistema (sin incluir contraseñas).
* **Parámetros de Petición (Request):**
  * *Headers:* `x-user-id` (string, requerido).
* **Respuestas del Servidor (Responses):**
  * **`HTTP 200` (Éxito):**
    ```json
    {
      "success": true,
      "data": [
        {
          "id": "1",
          "ruc": "1790011223002",
          "firstName": "Esteban",
          "lastName": "Quiroga",
          "email": "esteban.quiroga@example.com",
          "role": "user",
          "createdAt": "2026-06-11T20:00:00.000Z"
        }
      ]
    }
    ```

#### `PATCH` /admin/users/:userId/status
* **Descripción:** Actualiza administrativamente el estado activo o inactivo de la cuenta del usuario.
* **Parámetros de Petición (Request):**
  * *Headers:* `x-user-id` (string, requerido).
  * *Path Params:* `userId` (string - UUID de usuario requerido).
  * *Body (JSON):*
    ```json
    {
      "status": "inactive"
    }
    ```
* **Respuestas del Servidor (Responses):**
  * **`HTTP 200` (Éxito):**
    ```json
    {
      "success": true,
      "message": "User status updated to inactive"
    }
    ```
  * **`HTTP 400` (Error):**
    ```json
    {
      "success": false,
      "message": "Status is required"
    }
    ```

#### `DELETE` /admin/users/:userId
* **Descripción:** Elimina definitivamente el registro físico del usuario en la base de datos PostgreSQL, incluyendo todas sus dependencias relacionadas.
* **Parámetros de Petición (Request):**
  * *Headers:* `x-user-id` (string, requerido).
  * *Path Params:* `userId` (string - UUID de usuario requerido).
* **Respuestas del Servidor (Responses):**
  * **`HTTP 200` (Éxito):**
    ```json
    {
      "success": true,
      "message": "User deleted successfully"
    }
    ```

#### `GET` /admin/audit
* **Descripción:** Obtiene los últimos 100 logs globales de auditoría registrados en el sistema, uniendo los datos de los usuarios emisores.
* **Parámetros de Petición (Request):**
  * *Headers:* `x-user-id` (string, requerido).
* **Respuestas del Servidor (Responses):**
  * **`HTTP 200` (Éxito):**
    ```json
    {
      "success": true,
      "data": [
        {
          "id": "ae-9988-2233",
          "action": "USER_LOGIN",
          "module": "Auth",
          "details": "Sesión iniciada con éxito",
          "timestamp": "2026-06-11T21:00:00.000Z",
          "userId": "10ab87c1-df98-4c12-9844-0c58a1bd281f",
          "user": {
            "email": "esteban.quiroga@example.com",
            "ruc": "1790011223002"
          }
        }
      ]
    }
    ```

#### `PUT` /admin/settings
* **Descripción:** Guarda los parámetros generales de configuración del backend del ecosistema.
* **Parámetros de Petición (Request):**
  * *Headers:* `x-user-id` (string, requerido).
  * *Body (JSON):*
    ```json
    {
      "sriTargetUrl": "https://sri.gob.ec/portal-receptor",
      "maxDownloadThreads": 5
    }
    ```
* **Respuestas del Servidor (Responses):**
  * **`HTTP 200` (Éxito):**
    ```json
    {
      "success": true,
      "message": "Global settings updated successfully",
      "data": {
        "sriTargetUrl": "https://sri.gob.ec/portal-receptor",
        "maxDownloadThreads": 5
      }
    }
    ```

#### `GET` /admin/tickets
* **Descripción:** Recupera todos los tickets de soporte del sistema con la información del usuario creador.
* **Parámetros de Petición (Request):**
  * *Headers:* `x-user-id` (string, requerido).
* **Respuestas del Servidor (Responses):**
  * **`HTTP 200` (Éxito):**
    ```json
    {
      "success": true,
      "data": [
        {
          "id": "t-uuid-1",
          "subject": "Fallo en descarga automática",
          "category": "sri_download",
          "priority": "high",
          "description": "...",
          "status": "open",
          "userId": "userId",
          "createdAt": "2026-06-11T21:00:00.000Z",
          "user": {
            "firstName": "Esteban",
            "lastName": "Quiroga",
            "email": "esteban.quiroga@example.com"
          }
        }
      ]
    }
    ```

#### `PATCH` /admin/tickets/:ticketId/status
* **Descripción:** Actualiza el estado administrativo del ticket de soporte técnico.
* **Parámetros de Petición (Request):**
  * *Headers:* `x-user-id` (string, requerido).
  * *Path Params:* `ticketId` (string - UUID de ticket requerido).
  * *Body (JSON):*
    ```json
    {
      "status": "closed"
    }
    ```
* **Respuestas del Servidor (Responses):**
  * **`HTTP 200` (Éxito):**
    ```json
    {
      "success": true,
      "message": "Ticket status updated to closed",
      "data": {
        "id": "t-uuid-1",
        "status": "closed"
      }
    }
    ```

---

### Módulo: Soporte Técnico (Support)

Canal directo para que los contribuyentes emitan tickets de error o soporte y los almacenen en la persistencia general.

* **Prefijo base propuesto:** `/support`
* **Enrutador:** [support.routes.ts](file:///c:/Users/Angel%20Sabando/OneDrive/Documentos/workspace/ESPE2604-AWD30716-DEA/06Code/backEnd/src/routes/support.routes.ts)
* **Controlador:** [support.controller.ts](file:///c:/Users/Angel%20Sabando/OneDrive/Documentos/workspace/ESPE2604-AWD30716-DEA/06Code/backEnd/src/controllers/support.controller.ts)
* **Autenticación / Permisos:** Requiere cabecera de autenticación (`authMiddleware`).

#### `POST` /support/tickets
* **Descripción:** Crea e inserta un nuevo ticket de soporte de errores.
* **Parámetros de Petición (Request):**
  * *Headers:* `x-user-id` (string, requerido).
  * *Body (JSON):*
    ```json
    {
      "subject": "Fallo en descarga automática",
      "category": "sri_download",
      "priority": "high",
      "description": "El sistema se cuelga en el paso de descarga asíncrona de facturas recibidas"
    }
    ```
* **Respuestas del Servidor (Responses):**
  * **`HTTP 201` (Creado):**
    ```json
    {
      "success": true,
      "message": "Ticket creado exitosamente",
      "data": {
        "id": "t-uuid-1",
        "subject": "Fallo en descarga automática",
        "category": "sri_download",
        "priority": "high",
        "description": "El sistema se cuelga en el paso de descarga...",
        "status": "open",
        "userId": "10ab87c1-df98-4c12-9844-0c58a1bd281f",
        "createdAt": "2026-06-11T21:00:00.000Z"
      }
    }
    ```
  * **`HTTP 400` (Error):**
    ```json
    {
      "success": false,
      "message": "Missing required fields"
    }
    ```

#### `GET` /support/tickets
* **Descripción:** Retorna la lista de todos los tickets abiertos por el usuario autenticado.
* **Parámetros de Petición (Request):**
  * *Headers:* `x-user-id` (string, requerido).
* **Respuestas del Servidor (Responses):**
  * **`HTTP 200` (Éxito):**
    ```json
    {
      "success": true,
      "data": [
        {
          "id": "t-uuid-1",
          "subject": "Fallo en descarga automática",
          "category": "sri_download",
          "priority": "high",
          "description": "...",
          "status": "open",
          "userId": "10ab87c1-df98-4c12-9844-0c58a1bd281f",
          "createdAt": "2026-06-11T21:00:00.000Z"
        }
      ]
    }
    ```
