# storemovies — Movies Management API

API REST para gestión de películas. Node.js + Express + Supabase (PostgreSQL).

---

## Estructura del proyecto

```
storemovies/
├── config/
│   └── db.js               # Pool de conexión a PostgreSQL
├── models/
│   └── movie.js            # Consultas SQL y mapeo de entidad Movie
├── routes/
│   └── movieRoutes.js      # Endpoints y reglas de negocio
├── sql/
│   ├── 01_create_tables.sql
│   └── 02_seed_data.sql
├── .env.example
├── .gitignore
├── index.js                # Punto de entrada (adaptado de la plantilla)
└── package.json
```

> **Cambios respecto a la plantilla original**
> | Plantilla (`ws14LocalHostAPI`) | Este proyecto |
> |---|---|
> | `mongoose` (MongoDB) | `pg` (PostgreSQL) |
> | Credenciales hardcodeadas | Variables de entorno (`.env`) |
> | Puerto fijo `3000` | `process.env.PORT \|\| 3000` |
> | Ruta base `/computerstore` | Ruta base `/api/movies` |
> | Modelo `Customer` | Modelo `Movie` |

---

## 1. Configurar la base de datos (Supabase)

1. Inicia sesión en [supabase.com](https://supabase.com) y abre tu proyecto.
2. Ve a **SQL Editor** y ejecuta los scripts en orden:
   - `sql/01_create_tables.sql`
   - `sql/02_seed_data.sql`

---

## 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita `.env` con los datos de tu proyecto Supabase:

```
DB_HOST=aws-0-us-east-1.pooler.supabase.com
DB_PORT=6543
DB_NAME=postgres
DB_USER=postgres.[tu-project-ref]
DB_PASSWORD=[tu-password]
PORT=3000
```

> Los valores se encuentran en **Supabase → Project Settings → Database → Connection string (Transaction pooler)**.

---

## 3. Instalar dependencias y ejecutar

```bash
npm install
npm run dev       # desarrollo (nodemon)
npm start         # producción
```

---

## 4. Endpoints disponibles

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/movies` | Registrar película |
| `GET` | `/api/movies` | Obtener todas las películas |
| `GET` | `/api/movies/:id` | Obtener película por ID |
| `GET` | `/api/movies/:id/revenue` | Ingresos de una película (Regla 1) |
| `GET` | `/api/movies/ranking` | Ranking por rentabilidad (Regla 2) |

### POST `/api/movies`
```json
{
    "title": "Inception",
    "director": "Christopher Nolan",
    "genre": "Science Fiction",
    "releaseYear": 2010,
    "ticketPrice": 12.50,
    "ticketsSold": 1200000,
    "productionCost": 8000000
}
```

### GET `/api/movies/:id/revenue`
```json
{
    "movieId": 1,
    "title": "Inception",
    "revenue": 15000000
}
```

### GET `/api/movies/ranking`
```json
[
    {
        "title": "Inception",
        "revenue": 15000000,
        "profit": 7000000,
        "ranking": 1
    }
]
```

---

## 5. Despliegue en AWS (preparación)

El proyecto está listo para desplegarse en **AWS Elastic Beanstalk** o **EC2**:

- El puerto se toma de `process.env.PORT` (Elastic Beanstalk lo inyecta automáticamente en el puerto 8080).
- No hay credenciales hardcodeadas; todas las variables de entorno se configuran en la consola de AWS.
- El `package.json` incluye el script `"start": "node index.js"`, que es el comando que AWS utiliza por defecto.

**Pasos básicos para Elastic Beanstalk:**
1. Instala la CLI de EB: `pip install awsebcli`
2. `eb init` → selecciona plataforma Node.js
3. `eb create` → crea el entorno
4. Configura las variables de entorno en **EB Console → Configuration → Software → Environment properties**
5. `eb deploy`
