# Sistema Academico de Estudiantes

Proyecto backend REST con Express, programacion orientada a objetos, arquitectura MVC y reglas de negocio para reportes academicos.

Usa la misma conexion MongoDB del sistema anterior:

```text
mongodb://127.0.0.1:27017/ws14RestWebServices
```

La coleccion del nuevo sistema es `academic_students`. Los endpoints leen los estudiantes desde MongoDB.

## Ejecutar

```bash
cd student-academic-system
npm start
```

La vista estara disponible en:

```text
http://localhost:5010
```

## Atributos base del estudiante

Cada estudiante tiene 7 atributos:

- `id`
- `name`
- `descripcion`: carrera que sigue
- `fechaNacimiento`: se usa para calcular la edad
- `quintilSocioeconomico`: se usa para calcular el porcentaje base del costo del semestre
- `promedio`: se usa para ordenar los mejores estudiantes
- `porcentajeBeca`: se usa para calcular el descuento por beca

## Reglas de negocio

- Edad: se calcula desde `fechaNacimiento`.
- Porcentaje de pago por quintil:
  - Quintil 1: paga 35% del semestre.
  - Quintil 2: paga 50% del semestre.
  - Quintil 3: paga 70% del semestre.
  - Quintil 4: paga 85% del semestre.
  - Quintil 5: paga 100% del semestre.
- Beca: descuenta el `porcentajeBeca` sobre el valor ya ajustado por quintil.
- Mejores estudiantes: se ordenan por `promedio` de mayor a menor.
- Reporte general: calcula total de estudiantes, promedio general, recaudacion esperada y mejor promedio.

## URIs REST

| Metodo | URI | Descripcion |
| --- | --- | --- |
| GET | `/api/students` | Lista estudiantes con calculos de negocio |
| POST | `/api/students` | Crea un estudiante |
| GET | `/api/students/:id` | Consulta los 7 atributos base de un estudiante |
| PUT | `/api/students/:id` | Actualiza un estudiante |
| DELETE | `/api/students/:id` | Elimina un estudiante |
| GET | `/api/students/:id/report` | Reporte individual con edad, pago por quintil, beca y valor final |
| GET | `/api/students/:id/report/excel` | Descarga reporte individual en formato Excel |
| GET | `/api/reports/top-students?limit=5` | Reporte de mejores estudiantes por promedio |
| GET | `/api/reports/top-students/excel?limit=5` | Descarga mejores estudiantes en formato Excel |
| GET | `/api/reports/summary` | Reporte general de estudiantes |
| GET | `/api/reports/summary/excel` | Descarga reporte general en formato Excel |
| GET | `/api/health/database` | Verifica base, coleccion y total de documentos en MongoDB |
| GET | `/api/docs/uris` | Documentacion de URIs REST del sistema |

## Postman

Puedes importar esta coleccion:

```text
postman/student-academic-system.postman_collection.json
```

Body para `POST /api/students`:

```json
{
  "id": 8,
  "name": "Andrea Molina",
  "descripcion": "Contabilidad",
  "fechaNacimiento": "2004-05-16",
  "quintilSocioeconomico": 3,
  "promedio": 8.9,
  "porcentajeBeca": 15
}
```

Body para `PUT /api/students/8`:

```json
{
  "promedio": 9.4,
  "porcentajeBeca": 25
}
```

## Estructura MVC

```text
src/
  app.js
  controllers/
  data/
  models/
  repositories/
  routes/
  services/
public/
uml/
```

El archivo `uml/student-academic-system.drawio` se puede subir directamente a draw.io.
