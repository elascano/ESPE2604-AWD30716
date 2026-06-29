# Biconoirs Gourmet — Python API (v2)
## Arquitectura desacoplada · 2 servidores · MVC

```
┌─────────────────────────────────────────────────────┐
│         Cliente (Swagger /docs o curl)               │
└────────────────┬──────────────┬─────────────────────┘
                 │              │
    GET /ops/menu/dishes    GET /ops/ingredients/{sku}
                 │              │
┌────────────────▼──┐   ┌───────▼──────────────────────┐
│  CRUD Server      │◄──│  Business Logic Server        │
│  Puerto 3000      │   │  Puerto 8000                  │
│  (MVC)            │   │  (MVC · httpx · regla stock)  │
└───────────────────┘   └──────────────────────────────┘
         │                          │
         └────────────┬─────────────┘
                      ▼
              Supabase PostgreSQL
```

---

## Estructura MVC

```
serverCrud/
├── main.py
├── .env
├── requirements.txt
├── start.sh
├── models/
│   ├── database.py          ← conexión a PostgreSQL
│   └── menu_model.py        ← Pydantic schemas
├── controllers/
│   ├── dish_controller.py   ← lógica de consulta (menu_items)
│   └── ingredient_controller.py  ← lógica de consulta (ingredients)
└── routes/
    ├── dish_routes.py       ← GET /ops/menu/dishes
    └── ingredient_routes.py ← GET /ops/ingredients/{sku} (interno)

serverBL/
├── main.py
├── .env
├── requirements.txt
├── start.sh
├── models/
│   └── ingredient_model.py  ← Pydantic schema enriquecido
├── controllers/
│   └── ingredient_bl_controller.py  ← llama CRUD + clasifica stock
└── routes/
    └── ingredient_bl_routes.py  ← GET /ops/ingredients/{sku}
```

---

## Endpoints

### CRUD Server — Puerto 3000
| Método | URI | Descripción |
|--------|-----|-------------|
| GET | `/ops/menu/dishes` | Lista todos los platos del menú |
| GET | `/ops/ingredients/{sku_code}` | Datos base de un ingrediente *(uso interno del BL server)* |
| GET | `/health` | Health check |
| GET | `/docs` | Swagger UI — prueba las URIs directamente |

### Business Logic Server — Puerto 8000
| Método | URI | Descripción |
|--------|-----|-------------|
| GET | `/ops/ingredients/{sku_code}` | Ingrediente con stock clasificado (regla de negocio) |
| GET | `/health` | Health check |
| GET | `/docs` | Swagger UI — prueba las URIs directamente |

---

## Regla de negocio aplicada en el BL server

El BL server llama al CRUD server para obtener los datos base y luego consulta `inventory` para aplicar la clasificación:

| `stock_status`    | Condición                         |
|-------------------|-----------------------------------|
| `OK`              | Stock ≥ 75 % del nivel de reorden |
| `BAJO`            | Stock entre 25 % y 74 %           |
| `CRITICO`         | Stock < 25 % del nivel de reorden |
| `SIN_INVENTARIO`  | Sin registro en `inventory`       |

---

## Correr localmente

```bash
# Terminal 1 — CRUD Server
cd serverCrud
pip install -r requirements.txt
python main.py
# → http://localhost:3000/docs

# Terminal 2 — BL Server
cd serverBL
pip install -r requirements.txt
python main.py
# → http://localhost:8000/docs
```

---

## Despliegue en AWS (2 instancias EC2)

### Puertos a abrir en Security Groups
| Instancia    | Puerto |
|--------------|--------|
| CRUD Server  | 3000   |
| BL Server    | 8000   |

### Pasos

```bash
# En EC2 #1 — CRUD Server
scp -i clave.pem -r serverCrud/ ubuntu@<IP-CRUD>:~/
ssh -i clave.pem ubuntu@<IP-CRUD>
cd ~/serverCrud && ./start.sh

# En EC2 #2 — BL Server
scp -i clave.pem -r serverBL/ ubuntu@<IP-BL>:~/
ssh -i clave.pem ubuntu@<IP-BL>

# Editar el .env del BL server con la IP real del CRUD:
nano ~/serverBL/.env
# CRUD_SERVER_URL=http://<IP-CRUD>:3000

cd ~/serverBL && ./start.sh
```

### Solo el BL server necesita actualización al cambiar IP del CRUD
Edita `serverBL/.env`:
```env
CRUD_SERVER_URL=http://<IP-PUBLICA-CRUD>:3000
```
