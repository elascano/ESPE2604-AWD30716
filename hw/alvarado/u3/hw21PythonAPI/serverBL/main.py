import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.ingredient_bl_routes import router as ingredient_bl_router
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="Biconoirs Gourmet — Business Logic Server",
    description="""
Business rules server structured using MVC.
Queries the CRUD server and applies logic before responding.

## Endpoints
- **GET /ops/ingredients/{sku_code}** — Ingredient with classified stock status

## Applied business rule
Classifies ingredient stock according to reorder level:
- `OK` → stock ≥ 75%
- `LOW` → stock between 25% and 74%
- `CRITICAL` → stock < 25%
- `OUT_OF_STOCK` → no inventory record found
    """,
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ingredient_bl_router)


@app.get("/", tags=["Info"])
def root():
    return {
        "service":      "Business Logic Server — Biconoirs Gourmet",
        "status":       "ok",
        "swagger_ui":   "/docs",
        "port":         os.getenv("PORT", "8000"),
        "crud_server":  os.getenv("CRUD_SERVER_URL", "http://localhost:3000"),
    }


@app.get("/health", tags=["Info"])
def health():
    return {"status": "ok", "server": "business-logic"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=int(os.getenv("PORT", 8000)), reload=False)
