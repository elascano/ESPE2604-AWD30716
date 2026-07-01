# Patients Python Service

Este servicio web implementa toda la sección de pacientes (tanto la lógica de negocio como las operaciones CRUD de base de datos) en Python utilizando **FastAPI** y **SQLAlchemy**.

## Requisitos

- Python 3.8 o superior

## Instalación de dependencias

Instala las dependencias necesarias ejecutando:

```bash
pip install -r requirements.txt
```

## Configuración

El servicio leerá de forma automática las variables de entorno de la base de datos definidas en el archivo `.env` o en el archivo `env` del directorio principal.

Las variables clave son:
- `DATABASE_URL` o `DIRECT_URL`: La URL de la base de datos PostgreSQL de Supabase.
- `CRUD_API_KEY`: La clave API para las rutas CRUD (enviada en el header `x-api-key`).
- `JWT_SECRET`: La clave secreta para la decodificación de tokens de autenticación en las rutas de negocio.

## Ejecución del Servidor

Para iniciar el servidor local de desarrollo en el puerto 8000, ejecuta:

```bash
python app.py
```

O también puedes usar uvicorn directamente:

```bash
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

## Endpoints Implementados

### CRUD (Requieren Header `x-api-key: <CRUD_API_KEY>`)

- `POST /fabuladental/patients` - Registrar un paciente (con validaciones de edad, teléfono y representante legal).
- `GET /fabuladental/patients` - Obtener todos los pacientes.
- `GET /fabuladental/patients/{patientId}` - Obtener un paciente específico por ID.
- `PUT /fabuladental/patients/{patientId}` - Actualizar un paciente por ID.
- `DELETE /fabuladental/patients/{patientId}` - Eliminar un paciente por ID.

### Lógica de Negocio (Requieren Header `Authorization: Bearer <JWT_TOKEN>`)

- `POST /fabuladental/patients/pediatric-category` (Dentistas) - Calcula la edad y la categoría pediátrica correspondiente junto con el factor de dosificación.
- `POST /fabuladental/patients/legal-representative-validation` (Dentistas) - Valida si se requiere un representante legal según la edad y su presencia.
- `POST /fabuladental/patients/days-to-birthday` (Dentistas) - Calcula los días restantes para el próximo cumpleaños y si se encuentra dentro de la semana de cumpleaños.
- `POST /fabuladental/patients/senior-discount` (Recepcionistas) - Determina si aplica para el descuento de adulto mayor y el factor sugerido.
- `POST /fabuladental/patients/consultation-time-estimation` (Dentistas) - Calcula la estimación de tiempo necesario para la consulta.
- `POST /fabuladental/patients/contact-priority` (Recepcionistas) - Genera un puntaje de prioridad basado en urgencia del motivo y validez del número de teléfono.
