# Guía de Deploy en Vercel - Flova Frontend

## Configuración en Vercel Dashboard

### 1. Configuración del Proyecto

En la pantalla de configuración de Vercel, usa estos valores:

- **Framework Preset**: Vite
- **Root Directory**: `Flova_front` (importante: no usar `./`)
- **Build Command**: `npm run build` (se detecta automáticamente)
- **Output Directory**: `dist` (se detecta automáticamente)

### 2. Variables de Entorno

En la sección "Environment Variables" de Vercel, agrega:

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `VITE_API_BASE_URL` | URL de tu backend | Ejemplo: `https://tu-backend.onrender.com/api` |
| `VITE_APP_NAME` | Sistema de Gestión Médica | Nombre de la aplicación |

**Importante**: Las variables deben estar disponibles en todos los entornos (Production, Preview, Development).

### 3. Archivos Creados

Se han creado los siguientes archivos para el deploy:

- **`vercel.json`**: Configuración de rewrites para React Router (SPA)
- **`.vercelignore`**: Archivos a ignorar en el deploy

## Pasos para Deploy

### Opción 1: Deploy desde GitHub (Recomendado)

1. Asegúrate de que tu código esté en GitHub
2. En Vercel, selecciona "Import Project"
3. Conecta tu repositorio `bpgualotuna/Flova_front`
4. Configura el Root Directory como `Flova_front`
5. Agrega las variables de entorno
6. Click en "Deploy"

### Opción 2: Deploy desde CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Desde la carpeta Flova_front
cd Flova_front

# Login en Vercel
vercel login

# Deploy
vercel

# Para producción
vercel --prod
```

## Verificación Post-Deploy

Después del deploy, verifica:

1. ✅ La aplicación carga correctamente
2. ✅ El routing funciona (navegar a diferentes páginas y refrescar)
3. ✅ Las llamadas al backend funcionan (verificar en Network tab)
4. ✅ El login y autenticación funcionan
5. ✅ Las variables de entorno están configuradas correctamente

## Troubleshooting

### Error 404 al refrescar páginas

Si obtienes 404 al refrescar en rutas como `/dashboard`, verifica que `vercel.json` esté en la raíz de `Flova_front`.

### Error de CORS

Si hay errores de CORS, asegúrate de que tu backend en Render tenga configurado el origen de Vercel:

```typescript
// En tu backend
const allowedOrigins = [
  'https://tu-app.vercel.app',
  'http://localhost:3000'
];
```

### Variables de entorno no funcionan

- Verifica que las variables empiecen con `VITE_`
- Redeploya después de agregar variables de entorno
- Las variables se leen en build time, no en runtime

## Dominios Personalizados

Para agregar un dominio personalizado:

1. Ve a Project Settings → Domains
2. Agrega tu dominio
3. Configura los DNS según las instrucciones de Vercel

## Actualizaciones Automáticas

Vercel automáticamente:
- Deploya cada push a la rama `main` → Producción
- Deploya cada PR → Preview deployment
- Ejecuta el build y verifica errores

## Monitoreo

Vercel proporciona:
- Analytics de rendimiento
- Logs de build y runtime
- Métricas de uso

Accede desde el dashboard de tu proyecto.
