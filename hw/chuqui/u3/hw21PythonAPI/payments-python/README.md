# Payments Python API — Fábula Dental

API REST para el módulo de **Payments** de Fábula Dental, construida con **FastAPI** y **SQLAlchemy** como ORM sobre PostgreSQL.

## Stack tecnológico

| Componente | Tecnología | Equivalente TS |
|------------|-----------|----------------|
| Framework | **FastAPI** | Express |
| ORM | **SQLAlchemy** | Prisma |
| Validación | **Pydantic** | TypeScript types |
| BD Driver | **psycopg2** | pg |
| Variables env | **python-dotenv** | dotenv |

## Estructura del proyecto

```
payments-python/
├── app/
│   ├── main.py               ← Entry point FastAPI
│   ├── database.py           ← Conexión SQLAlchemy (equivalente a db.ts)
│   ├── models/payment.py     ← ORM model (equivalente a schema.prisma)
│   ├── schemas/payment.py    ← Pydantic schemas (validación)
│   ├── crud/payment.py       ← Operaciones CRUD con SQLAlchemy
│   ├── routers/
│   │   ├── payments_crud.py      ← Endpoints CRUD
│   │   └── payments_business.py  ← Endpoints de lógica de negocio
│   └── business/payment_logic.py ← Cálculos de negocio
├── requirements.txt
├── .env.example
└── README.md
```

## Instalación

```bash
# 1. Crear entorno virtual
python -m venv venv

# 2. Activar entorno virtual
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# 3. Instalar dependencias
pip install -r requirements.txt

# 4. Configurar variables de entorno
cp .env.example .env
# Editar .env con la URL de tu base de datos PostgreSQL

# 5. Ejecutar servidor
uvicorn app.main:app --reload --port 8000
```

## Documentación automática

Una vez ejecutando, accede a:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Endpoints

### CRUD de Payments
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/fabuladental/payments` | Listar todos los pagos |
| POST | `/fabuladental/payments` | Registrar un nuevo pago |
| PUT | `/fabuladental/payments/{payment_id}` | Actualizar un pago |
| DELETE | `/fabuladental/payments/{payment_id}` | Eliminar un pago |

### Business Logic
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/fabuladental/payments/history` | Historial con status calculado |
| GET | `/fabuladental/payments/revenue-summary` | Resumen total de recaudación |
| GET | `/fabuladental/payments/method-breakdown` | Desglose por método de pago |
| GET | `/fabuladental/payments/pending-balances` | Pagos parciales pendientes |
| GET | `/fabuladental/payments/patients/{patient_id}` | Pagos por paciente |
| POST | `/fabuladental/payments/calculate-status` | Calcular status de un pago |

## Reglas de negocio

- `patientID` debe ser exactamente 10 dígitos numéricos
- `amount` debe ser mayor a 0
- `date` no puede ser una fecha futura
- `paymentType` acepta: `Deposit` o `Final`
- `paymentMethod` acepta: `Cash`, `Card` o `Transfer`
- Si `paymentType == "Final"` → `status = "Completed"`
- Si `paymentType == "Deposit"` → `status = "Partial"`
