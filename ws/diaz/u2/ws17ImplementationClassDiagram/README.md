# ws16EndPoints

API de libros con cálculo de precio final e índice de reseñas.

## Ejecutar localmente

1. Instala dependencias:
   ```bash
   npm install
   ```
2. Ejecuta el servidor:
   ```bash
   npm start
   ```
3. La API quedará disponible en:
   ```
   http://localhost:5006
   ```

## Variables de entorno

Render debe definir esta variable:

- `MONGODB_URI` -> cadena de conexión a MongoDB

El servidor usa `process.env.PORT` si Render la proporciona.

## Despliegue en Render

1. Crea un repositorio Git con este proyecto.
2. En Render, crea un nuevo servicio de tipo `Web Service`.
3. Selecciona el repositorio y configura:
   - `Environment`: `Node`
   - `Build Command`: `npm install`
   - `Start Command`: `npm start`
4. Añade la variable de entorno `MONGODB_URI` en Render o crea el secret `MONGODB_URI`.
5. Render desplegará automáticamente desde la rama `main`.

También puedes usar `render.yaml` para configuración automática de Render.

## Endpoints útiles

- `GET /library/books` — lista todos los libros
- `GET /library/books/with-tax` — lista libros con `price_final` (precio + 15% IVA)
- `GET /library/books/average-rating` — promedio de `review_score`
- `GET /library/books/:id` — libro por `id`

## Importante

Si usas Render con `render.yaml`, asegúrate de tener creado el secret `MONGODB_URI` en tu cuenta de Render antes de desplegar.
