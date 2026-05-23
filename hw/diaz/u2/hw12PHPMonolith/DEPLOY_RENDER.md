# Guía de Despliegue en Render (Actualizada)

Este documento contiene la guía actualizada para desplegar el proyecto en Render utilizando Docker, Nginx, PHP-FPM y Supervisor.

## Problemas Corregidos

### 1. Error Principal: `Class "MongoDB\Client" not found`
**Causa**: La configuración inicial de Docker y Composer no era la óptima para un entorno de producción en Render.
**Solución**: 
- Se ha reestructurado el `Dockerfile` para seguir las mejores prácticas.
- Se ha añadido `supervisor` para gestionar los procesos de `nginx` y `php-fpm` de forma robusta.

### 2. Configuración de Entorno
**Causa**: El proyecto dependía de un `Procfile` y configuraciones de Nginx que no estaban optimizadas para un entorno gestionado por `supervisor`.
**Solución**:
- Se ha creado `supervisord.conf` para definir cómo se ejecutan los servicios.
- Se ha creado `php-fpm.conf` para asegurar que PHP-FPM se inicie correctamente.
- Se ha actualizado `nginx.conf` para comunicarse con `php-fpm` a través de un socket Unix.
- El `Procfile` ahora simplemente inicia `supervisor`.

---

## Configuración de Variables de Entorno en Render

### Paso 1: Crear nuevo Web Service en Render
1. Ve a [render.com](https://render.com)
2. Haz clic en "New +" → "Web Service"
3. Conecta tu repositorio de GitHub.

### Paso 2: Llenar los campos de configuración

| Campo | Valor |
|-------|-------|
| **Name** | `product-inventory` (o tu nombre preferido) |
| **Environment** | `Docker` |
| **Branch** | `main` (o tu rama principal) |
| **Build Command** | (dejar vacío - Render usa el `Dockerfile` automáticamente) |
| **Start Command** | (dejar vacío - Render usa el `Procfile` o el `CMD` del `Dockerfile`) |

### Paso 3: Variables de Entorno (Environment)

Haz clic en "Advanced" → "Add Environment Variable" y configura:

```
MONGODB_URI = mongodb+srv://cvdiaz3_db_user:admin123@cluster0.vigvruj.mongodb.net/product_db?retryWrites=true&w=majority
APP_DEBUG = false
APP_ENV = production
```

**IMPORTANTE**: Asegúrate de que la IP de tu máquina o las IPs de Render estén en la lista blanca de MongoDB Atlas (para despliegue, lo más fácil es permitir el acceso desde cualquier IP: `0.0.0.0/0`).

### Paso 4: Desplegar

- **Auto-Deploy**: ✅ Habilitado (recomendado).
- Haz clic en "Create Web Service".

Render construirá la imagen de Docker y lanzará los servicios como se define en `supervisord.conf`.

---

## Checklist Final

- [x] `Dockerfile` actualizado con `supervisor`.
- [x] `nginx.conf` configurado para `php-fpm` vía socket.
- [x] `Procfile` actualizado para lanzar `supervisor`.
- [x] `supervisord.conf` creado para gestionar `nginx` y `php-fpm`.
- [x] `php-fpm.conf` creado para la configuración del pool.
- [x] Variables de entorno configuradas en el dashboard de Render.
- [x] Repositorio con todos los cambios subidos a GitHub.
- [x] Servicio creado en Render y despliegue iniciado.

---

## Troubleshooting Común

### Error: "Connection refused" al conectar a MongoDB
- **Verifica la IP Whitelist**: Asegúrate de que MongoDB Atlas permite conexiones desde `0.0.0.0/0`.
- **Verifica la URI**: Confirma que la `MONGODB_URI` en Render es correcta y no tiene errores de tipeo.

### Error: 502 Bad Gateway
- **Revisa los logs de Render**: Busca errores en los logs de `php-fpm` o `nginx`. Puede ser un problema en el código PHP que impide que FPM se inicie correctamente.
- **Socket de PHP-FPM**: Asegúrate de que la ruta al socket en `nginx.conf` (`unix:/run/php/php8.2-fpm.sock`) coincida con la de `php-fpm.conf`.

