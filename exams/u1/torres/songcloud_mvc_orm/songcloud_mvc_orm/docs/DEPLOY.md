# Deploy de SongCloud MVC ORM

## Opcion ya probada en esta PC

La app corre con Docker Compose:

```bash
docker compose up -d --build
```

Esto levanta:

- `songcloud-app`: PHP 8.3 + Apache en `http://localhost:8000`
- `songcloud-db`: MariaDB 11.4 con `database/migrations.sql` y `database/seed.sql`

Verificaciones:

```bash
curl http://localhost:8000/health
docker exec songcloud-db mariadb -usongcloud_user -psongcloud_password songcloud_db -e "SELECT COUNT(*) FROM songs;"
```

Para detener:

```bash
docker compose down
```

Para borrar tambien la base local y reinicializar desde cero:

```bash
docker compose down -v
docker compose up -d --build
```

## URL publica temporal con Cloudflare Tunnel

Se puede publicar la app local con:

```bash
tools/cloudflared.exe tunnel --url http://localhost:8000 --no-autoupdate
```

Cloudflare genera una URL `https://*.trycloudflare.com`. Esta opcion es buena para evidencia, pruebas o demo rapida, pero no garantiza uptime permanente.

## Despliegue permanente recomendado

Netlify no es una buena opcion directa para este proyecto porque la app es PHP tradicional con Apache y base MySQL/MariaDB. Netlify Functions soporta runtimes serverless como JavaScript/TypeScript y Go, no un servidor PHP-Apache completo.

Opciones mas adecuadas:

- Railway: puede desplegar Docker y agregar una base MySQL/MariaDB desde el dashboard.
- Render: puede desplegar el `Dockerfile`, pero necesita una base MySQL/MariaDB externa porque el proyecto usa PDO MySQL.
- Hosting PHP compartido: apuntar el document root a `public` y cargar las variables `DB_*`.

Variables necesarias:

```env
APP_NAME="SongCloud MVC ORM"
APP_ENV=production
APP_URL=https://tu-url-publica
DB_HOST=...
DB_PORT=3306
DB_DATABASE=songcloud_db
DB_USERNAME=...
DB_PASSWORD=...
DB_CHARSET=utf8mb4
```
