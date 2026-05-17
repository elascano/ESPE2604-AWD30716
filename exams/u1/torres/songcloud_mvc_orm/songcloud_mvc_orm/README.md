# SongCloud MVC ORM — CRUD de canciones en PHP

Proyecto completo para el ejercicio: página web dinámica con arquitectura **MVC**, conexión a base de datos **MariaDB/MySQL en la nube**, CRUD de canciones, búsqueda, lectura total e inserción usando un **ORM tipo Active Record** incluido en el proyecto.

## Funcionalidades incluidas

- Arquitectura **MVC** separada por carpetas.
- ORM propio incluido: `app/Core/ORM/Model.php`.
- Base de datos en nube mediante `.env`.
- Tabla `songs` con **ID + 10 atributos**.
- Insertar canciones.
- Buscar canciones por título, artista, álbum o género.
- Leer/listar toda la colección/tabla.
- Ver detalle de cada canción.
- Editar y eliminar registros.
- Cálculo automático de:
  - Ganancia estimada = reproducciones × pago por reproducción.
  - Puntaje de popularidad calculado con streams, likes y rating.
- Cálculo dinámico en **JavaScript** dentro del formulario.
- Cálculo equivalente en **PHP** para mostrar resultados desde el servidor.
- Buen diseño visual responsive.
- Documento editable de evidencias en `docs/evidencia_examen.docx`.

## Atributos de la tabla/colección `songs`

| Campo | Tipo | Descripción |
|---|---:|---|
| id | INT | Identificador único |
| title | VARCHAR | Título de la canción |
| artist | VARCHAR | Artista principal |
| album | VARCHAR | Álbum |
| genre | VARCHAR | Género musical |
| duration_seconds | INT | Duración en segundos |
| release_year | INT | Año de lanzamiento |
| streams | BIGINT | Número de reproducciones |
| likes | BIGINT | Número de likes |
| rating | DECIMAL | Calificación de 0 a 5 |
| explicit_content | TINYINT | Si contiene contenido explícito |
| royalty_per_stream | DECIMAL | Pago estimado por reproducción |

## Estructura MVC

```txt
songcloud_mvc_orm/
├── app/
│   ├── Controllers/SongController.php
│   ├── Core/
│   │   ├── Database.php
│   │   ├── Env.php
│   │   ├── Router.php
│   │   ├── Security.php
│   │   ├── View.php
│   │   └── ORM/Model.php
│   ├── Models/Song.php
│   ├── Services/SongCalculator.php
│   └── Views/
├── bootstrap/app.php
├── config/config.php
├── database/migrations.sql
├── database/seed.sql
├── docs/evidencia_examen.docx
├── public/index.php
└── public/assets/
```

## Configuración rápida

### 1. Crear base de datos en la nube

Puede usar cualquier proveedor que entregue conexión MySQL/MariaDB, por ejemplo:

- Railway MySQL/MariaDB
- Aiven MySQL
- Clever Cloud MySQL
- AlwaysData MySQL
- PlanetScale compatible MySQL
- Hosting con MariaDB remoto

Cree una base de datos llamada, por ejemplo:

```sql
songcloud_db
```

### 2. Ejecutar la migración

Abra el panel SQL de su proveedor cloud y ejecute:

```sql
-- archivo: database/migrations.sql
```

Luego, opcionalmente, ejecute:

```sql
-- archivo: database/seed.sql
```

### 3. Configurar `.env`

Copie `.env.example` como `.env` y cambie los datos por los de su base cloud:

```env
APP_NAME="SongCloud MVC ORM"
APP_ENV=production
APP_URL=https://su-dominio-o-url-cloud.com

DB_HOST=su-host-cloud
DB_PORT=3306
DB_DATABASE=songcloud_db
DB_USERNAME=su_usuario
DB_PASSWORD=su_password
```

### 4. Ejecutar localmente

Desde la carpeta del proyecto:

```bash
php -S localhost:8000 -t public
```

Abra:

```txt
http://localhost:8000
```

### 5. Subir a la nube

Opciones recomendadas:

- Render/Railway con Dockerfile incluido.
- Hosting PHP compartido apuntando el dominio a la carpeta `public`.
- VPS con Apache/Nginx y PHP.

Si usa hosting compartido y no puede apuntar a `public`, suba el contenido de `public` a `public_html` y mantenga `app`, `bootstrap`, `config` y `database` fuera del directorio público cuando sea posible.

## Evidencias para el examen

El documento editable está en:

```txt
docs/evidencia_examen.docx
```

Debe abrirlo en Word o Google Docs y reemplazar los cuadros por capturas reales de:

1. Creación de la base de datos cloud.
2. Ejecución del script SQL.
3. Tabla `songs` creada.
4. Variables de entorno o configuración de conexión.
5. Aplicación subida a la nube.
6. Formulario de inserción.
7. Búsqueda/listado de canciones.
8. Cálculo automático de ganancia y popularidad.
9. Estructura MVC del proyecto.
10. Código ORM usado.

## Nota importante

El ZIP ya contiene el sistema listo. Para que funcione en internet, necesita colocar los datos reales de su base de datos cloud en `.env` y ejecutar `database/migrations.sql`. No se incluyen credenciales reales por seguridad.
