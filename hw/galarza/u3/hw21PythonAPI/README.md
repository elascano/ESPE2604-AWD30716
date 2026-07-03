# Clinic Management API
RESTful API desarrollada en Python usando FastAPI y MongoDB para la gestión integral de un centro de rehabilitación clínica.

## Tecnologías Utilizadas
- Python 3.10+
- FastAPI
- MongoDB (Motor Asyncio)
- Uvicorn

## Instalación y Ejecución Local
1. Clonar el repositorio.
2. Instalar las dependencias: `pip install -r requirements.txt`
3. Crear un archivo `.env` en la raíz con su `MONGO_URI`.
4. Ejecutar el servidor: `uvicorn main:app --reload --port 4000`

## Estructura de URIs
El sistema respeta principios RESTful. Ejemplo de consulta de disponibilidad:
`GET /api/appointments/available-schedules?doctorId={id}&date={YYYY-MM-DD}`
