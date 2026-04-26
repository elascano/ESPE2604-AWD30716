# Conexion con Supabase

Este mockup ya esta preparado para leer y guardar datos en Supabase usando `fetch`, sin frameworks ni librerias externas.

## 1. Crear el proyecto

1. Entra a Supabase y crea un proyecto.
2. Abre `SQL Editor`.
3. Ejecuta el archivo `database/supabase_schema.sql`.

Ese SQL crea estas tablas:

- `sedes`
- `alumnos`
- `mensualidades`
- `asistencias`

Tambien agrega datos iniciales y politicas RLS simples para que el mockup pueda leer e insertar desde el navegador.

## 2. Configurar las credenciales

En Supabase, ve a `Project Settings > API` y copia:

- Project URL
- anon public key

Luego edita `script/supabase-config.js`:

```js
window.SUPABASE_CONFIG = {
  url: "https://TU-PROYECTO.supabase.co",
  anonKey: "TU_ANON_KEY"
};
```

## 3. Abrir las vistas

Abre cualquiera de estas paginas:

- `view/alumnos.html`
- `view/mensualidades.html`
- `view/asistencia.html`

Las tablas cargan desde Supabase y los formularios guardan directamente en la nube.

## Nota de seguridad

Las politicas incluidas son solo para mockup academico. En el sistema real se debe agregar autenticacion, roles, permisos por sede y politicas RLS mas estrictas.
