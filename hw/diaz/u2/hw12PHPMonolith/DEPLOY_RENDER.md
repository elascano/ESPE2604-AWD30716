# Guía de Despliegue en Render

## Problemas Corregidos

### 1. Error Principal: `Class "MongoDB\Client" not found`
**Causa**: Las dependencias de Composer no se instalaban correctamente durante el build.
**Solución**: 
- Actualizado `Dockerfile` para usar FPM + Nginx (compatible con Render)
- Mejorada la instalación de Composer
- Agregada configuración correcta de autoload

### 2. Bug en bootstrap.php
**Causa**: `strpos($line, '#') === 0` saltaba líneas que comienzan con `#` (comentarios).
**Solución**: Cambio a `strpos($line, '#') !== 0` para ignorar comentarios correctamente.

### 3. Namespace incorrecto en Database.php
**Causa**: La clase no tenía namespace, causando conflictos de autoload.
**Solución**: Agregado `namespace Config;`

### 4. Procfile incompatible
**Causa**: Usaba sintaxis de Heroku (`heroku-php-apache2`).
**Solución**: Actualizado para ejecutar PHP-FPM + Nginx directamente.

---

## Configuración de Variables de Entorno en Render

### Paso 1: Crear nuevo Web Service en Render
1. Ve a [render.com](https://render.com)
2. Haz clic en "New +" → "Web Service"
3. Conecta tu repositorio GitHub

### Paso 2: Llenar los campos de configuración

| Campo | Valor |
|-------|-------|
| **Name** | `product-inventory` (o tu nombre preferido) |
| **Environment** | `Docker` |
| **Branch** | `main` (o tu rama principal) |
| **Build Command** | (dejar vacío - Render usa Dockerfile automáticamente) |
| **Start Command** | (dejar vacío - usa CMD del Dockerfile) |

### Paso 3: Variables de Entorno (Environment)

Haz clic en "Advanced" → "Add Environment Variable" y configura:

```
MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/product_db?retryWrites=true&w=majority
APP_DEBUG = false
APP_ENV = production
```

#### Obtener tu MONGODB_URI:
1. Ve a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Ve a tu cluster → "Connect"
3. Selecciona "Drivers" → "PHP"
4. Copia la cadena de conexión completa
5. **IMPORTANTE**: Reemplaza `<password>` con tu contraseña de usuario
6. Reemplaza `myFirstDatabase` con `product_db`

**Ejemplo completo:**
```
mongodb+srv://cvdiaz3_db_user:TuContraseña123@cluster0.vigvruj.mongodb.net/product_db?retryWrites=true&w=majority
```

### Paso 4: Opciones de Despliegue

- **Auto-Deploy**: ✅ Habilitado (se despliega automáticamente al hacer push)
- **Plan**: Elige según necesidad (Starter Plan es suficiente para desarrollo)
- **Region**: Selecciona la más cercana a tu ubicación

### Paso 5: Monitoreo Post-Despliegue

Verifica que no haya errores:
1. Ve a "Logs" en tu servicio de Render
2. Busca errores relacionados con MongoDB o autoload
3. Si hay problemas, revisa que:
   - ✅ `MONGODB_URI` esté configurado correctamente
   - ✅ La contraseña no tenga caracteres especiales sin escapar
   - ✅ Las dependencias se instalaron (debe aparecer en logs)

---

## Checklist Final

- [ ] Dockerfile actualizado con FPM + Nginx
- [ ] nginx.conf configurado correctamente
- [ ] Procfile actualizado para Render
- [ ] Database.php tiene namespace `Config`
- [ ] Product.php importa `Config\Database`
- [ ] bootstrap.php sin bug en strpos
- [ ] .env.example con ejemplo de MONGODB_URI
- [ ] Variables de entorno configuradas en Render
- [ ] Repositorio con todos los cambios (git push)
- [ ] Servicio creado en Render
- [ ] Deploy completado sin errores

---

## Troubleshooting

### Error: "MongoDB\Client not found"
- Verifica que Composer se ejecutó en el build
- Revisa logs de Render para errores durante instalación

### Error: "Connection refused"
- Confirma que MONGODB_URI es correcto
- Verifica que IP whitelist en MongoDB Atlas incluya `0.0.0.0/0` (o IPs de Render)

### Error: ".env not found"
- En Render, configura variables de entorno directamente en dashboard
- El archivo .env.example es solo para referencia local

