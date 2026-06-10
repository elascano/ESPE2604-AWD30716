# Guia rapida para revision en Postman

Base URL:

```text
http://18.226.20.6
```

## Orden recomendado

1. `GET /api/students`
   - Muestra todos los estudiantes con calculos.

2. `GET /api/health/database`
   - Demuestra que el backend esta conectado a MongoDB y lee la coleccion `academic_students`.

3. `GET /api/students/1`
   - Muestra los 7 atributos base del estudiante.

4. `GET /api/students/1/report`
   - Muestra reporte individual con edad, quintil, beca y valor a pagar.

5. `GET /api/reports/top-students?limit=5`
   - Muestra mejores estudiantes ordenados por promedio.

6. `GET /api/reports/summary`
   - Muestra total, promedio general, recaudacion y mejor estudiante.

7. `GET /api/reports/summary/excel`
   - Descarga reporte general en Excel.

8. `POST /api/students`
   - Crear estudiante.

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

9. `PUT /api/students/8`
   - Actualizar estudiante.

```json
{
  "promedio": 9.4,
  "porcentajeBeca": 25
}
```

10. `GET /api/students/8/report`
   - Verificar calculos del estudiante creado.

11. `DELETE /api/students/8`
    - Eliminar estudiante de prueba.

## Que explicar si preguntan que se revisa en una URI

- El metodo HTTP: `GET`, `POST`, `PUT`, `DELETE`.
- El recurso: por ejemplo `/api/students`.
- Los parametros: por ejemplo `:id` en `/api/students/1`.
- El body JSON en `POST` y `PUT`.
- El codigo de respuesta: `200`, `201`, `404`, etc.
- La respuesta del backend: JSON o archivo Excel.
- Que los calculos salen del backend, no del frontend.
