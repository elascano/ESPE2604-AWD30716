# AWD U2 - Goalkeeper Gloves REST API

Back-end REST para gestionar informacion de guantes de arquero en una empresa e-business.

Objeto asignado: `Goalkeeper gloves`.

URI base del servicio: `/api/gloves`.

## Que contiene

- Backend Node.js + Express.
- MongoDB + Mongoose.
- Rutas REST completas: `GET`, `POST`, `PUT`, `DELETE`.
- Regla de negocio para guantes de arquero: segun `brand` y `size`, la API asigna un rango automatico.
- Borrado logico opcional.
- Campos requeridos de examen: serial number, brand, model, size, gripType, isNew y price.
- Campo `attributes` para detalles opcionales.
- Diagramas `.drawio` para abrir en diagrams.net.
- Guia para correrlo en otra computadora.
- Guia para subirlo a una instancia AWS EC2.

## Estructura

```text
u2-any-object-api-template/
  index.js
  package.json
  .env.example
  src/
    config/
    controllers/
    models/
    routes/
    services/
  examples/
    requests.http
    sample-body.json
  docs/
    AWS_EC2_DEPLOY.md
    ARCHITECTURE_TO_DRAW_BY_HAND.md
    CLASS_DIAGRAM_TO_DRAW_BY_HAND.md
    EXAM_CHECKLIST.md
    diagrams/
```

## Uso rapido en otra computadora

1. Copia esta carpeta completa a la otra computadora.
2. Abre terminal dentro de la carpeta.
3. Instala dependencias:

```bash
npm install
```

4. Copia el archivo de configuracion:

```bash
cp .env.example .env
```

En Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

5. Edita `.env` con tu URI real de MongoDB Atlas.
6. Valida la configuracion:

```bash
npm run validate:env
```

7. Ejecuta:

```bash
npm start
```

8. Prueba:

```text
http://localhost:3000/
http://localhost:3000/api/gloves/health
http://localhost:3000/api/gloves/metadata
```

## Configuracion del objeto asignado

```env
INSTANCE_ROLE=all
OBJECT_NAME=glove
OBJECT_PLURAL=gloves
COLLECTION_NAME=gloves
API_BASE_PATH=/api/gloves
ID_FIELD=serialNumber
PRICE_FIELD=price
BUSINESS_RULE=brand_size_range
PREMIUM_BRANDS=Adidas,Nike,Puma,Reusch,Uhlsport,Elite
```

## Dos instancias

Si el profesor pide separar metodos en dos instancias, sube el mismo proyecto a ambas EC2 y cambia solo `INSTANCE_ROLE` en cada `.env`.

Instancia de lectura:

```env
INSTANCE_ROLE=read
```

Permite:

```text
GET /api/gloves
GET /api/gloves/:id
GET /api/gloves/health
GET /api/gloves/metadata
```

Instancia de escritura:

```env
INSTANCE_ROLE=write
```

Permite:

```text
POST   /api/gloves
PUT    /api/gloves/:id
DELETE /api/gloves/:id
POST   /api/gloves/:id/recompute
GET    /api/gloves/health
GET    /api/gloves/metadata
```

Ambas instancias deben usar el mismo `MONGODB_URI`, la misma base de datos y la misma coleccion `gloves`.

## JSON base para Postman

```json
{
  "serialNumber": "GL-001",
  "brand": "GoalKeeper",
  "model": "Pro Grip",
  "size": "M",
  "gripType": "negative cut",
  "description": "Exam sample object",
  "color": "black",
  "material": "latex",
  "isNew": true,
  "price": 25.5,
  "attributes": {
    "category": "sports",
    "warrantyMonths": 6
  }
}
```

Regla de negocio:

- Si la marca es premium y la talla es senior, `assignedRange=professional`.
- Si la marca es premium y la talla es intermedia, `assignedRange=advanced`.
- Si la talla es junior, `assignedRange=junior`.
- En otros casos, `assignedRange=training`.
- Si la talla no se puede clasificar, `assignedRange=review`.

## Endpoints

Con la configuracion por defecto:

```text
GET    /api/gloves/health
GET    /api/gloves/metadata
GET    /api/gloves
GET    /api/gloves/:id
POST   /api/gloves
PUT    /api/gloves/:id
DELETE /api/gloves/:id
POST   /api/gloves/:id/recompute
```

`DELETE` hace borrado logico si `SOFT_DELETE=true`. Para borrar de verdad:

```text
DELETE /api/gloves/GL-001?hard=true
```

## Para entregar evidencia

Minimo prepara:

- Captura de MongoDB Atlas/Compass mostrando la coleccion.
- Captura de Postman o navegador llamando el endpoint.
- Captura del servidor corriendo.
- Diagrama de arquitectura a mano.
- Diagrama de clases a mano.
- Si se sube a AWS: URL/IP publica funcionando.

Revisa:

- `docs/EXAM_CHECKLIST.md`
- `docs/OBJECT_CONFIG_EXAMPLES.md`
- `docs/AWS_EC2_DEPLOY.md`
- `docs/ARCHITECTURE_TO_DRAW_BY_HAND.md`
- `docs/CLASS_DIAGRAM_TO_DRAW_BY_HAND.md`

## Diagramas draw.io

Abre estos archivos en https://app.diagrams.net:

- `docs/diagrams/architecture.drawio`
- `docs/diagrams/class-diagram.drawio`
