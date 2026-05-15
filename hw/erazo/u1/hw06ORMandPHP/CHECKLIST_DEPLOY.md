# ✅ Checklist de Deploy - Vercel

## Pre-Deploy

### 1. Archivos de Configuración
- [x] `vercel.json` creado (para routing de SPA)
- [x] `.vercelignore` creado
- [x] `.gitignore` configurado correctamente
- [ ] `.env` NO está en el repositorio (verificar)

### 2. Código
- [ ] Build local funciona sin errores: `npm run build`
- [ ] Preview local funciona: `npm run preview`
- [ ] No hay errores de TypeScript: `npm run build:check`
- [ ] Código está commiteado en Git
- [ ] Código está pusheado a GitHub

### 3. Variables de Entorno
Preparar estas variables para configurar en Vercel:

| Variable | Valor | Ejemplo |
|----------|-------|---------|
| `VITE_API_BASE_URL` | URL del backend | `https://tu-backend.onrender.com/api` |
| `VITE_APP_NAME` | Nombre de la app | `Sistema de Gestión Médica` |

## Configuración en Vercel

### 1. Configuración del Proyecto
- [ ] Framework Preset: **Vite**
- [ ] Root Directory: **`Flova_front`** (NO usar `./`)
- [ ] Build Command: `npm run build` (auto-detectado)
- [ ] Output Directory: `dist` (auto-detectado)

### 2. Variables de Entorno
- [ ] `VITE_API_BASE_URL` agregada
- [ ] `VITE_APP_NAME` agregada
- [ ] Variables habilitadas para Production, Preview y Development

### 3. Deploy
- [ ] Click en "Deploy"
- [ ] Esperar a que termine el build (2-3 minutos)

## Post-Deploy

### 1. Verificación Básica
- [ ] La aplicación carga en la URL de Vercel
- [ ] No hay errores en la consola del navegador
- [ ] El diseño se ve correctamente

### 2. Verificación de Routing
- [ ] Navegar a `/login` funciona
- [ ] Navegar a `/register` funciona
- [ ] Navegar a `/dashboard` funciona
- [ ] **Refrescar la página** en `/dashboard` NO da 404
- [ ] Navegar a `/terapias` funciona
- [ ] Navegar a `/mis-citas` funciona

### 3. Verificación de Backend
- [ ] Abrir DevTools → Network
- [ ] Intentar hacer login
- [ ] Verificar que las peticiones van a la URL correcta del backend
- [ ] Verificar que no hay errores de CORS

### 4. Verificación de Funcionalidad
- [ ] Login funciona
- [ ] Registro funciona
- [ ] Navegación entre páginas funciona
- [ ] Logout funciona
- [ ] Protección de rutas funciona (redirige a login si no autenticado)

## Troubleshooting

### ❌ Error: 404 al refrescar páginas
**Solución:** Verifica que `vercel.json` esté en `Flova_front/vercel.json`

### ❌ Error: Variables de entorno no funcionan
**Solución:** 
1. Verifica que empiecen con `VITE_`
2. Redeploya el proyecto después de agregar variables
3. Limpia caché del navegador

### ❌ Error: CORS al llamar al backend
**Solución:** Configura CORS en tu backend para permitir el dominio de Vercel:
```typescript
const allowedOrigins = [
  'https://tu-app.vercel.app',
  'http://localhost:3000'
];
```

### ❌ Error: Build falla
**Solución:**
1. Verifica que `npm run build` funcione localmente
2. Revisa los logs de build en Vercel
3. Verifica que todas las dependencias estén en `package.json`

### ❌ Error: Root Directory incorrecto
**Solución:** En Vercel Settings → General → Root Directory, cambia a `Flova_front`

## Comandos Útiles

```bash
# Build local
npm run build

# Preview local
npm run preview

# Verificar TypeScript
npm run build:check

# Deploy con Vercel CLI
cd Flova_front
vercel
vercel --prod
```

## Notas Importantes

1. **Root Directory:** DEBE ser `Flova_front`, no `./`
2. **Variables de entorno:** Se leen en BUILD TIME, no en runtime
3. **Redeploy:** Necesario después de cambiar variables de entorno
4. **CORS:** Tu backend debe permitir el dominio de Vercel
5. **Caché:** Limpia caché del navegador si ves contenido antiguo

## Recursos

- [Documentación de Vercel](https://vercel.com/docs)
- [Guía de Deploy Completa](./DEPLOY_VERCEL.md)
- [Vite en Vercel](https://vercel.com/docs/frameworks/vite)

---

**¿Todo listo?** Procede con el deploy en Vercel 🚀
