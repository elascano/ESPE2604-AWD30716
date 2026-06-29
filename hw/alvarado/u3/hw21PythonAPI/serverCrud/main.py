import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.dish_routes import router as dish_router
from routes.ingredient_routes import router as ingredient_router
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="Biconoirs Gourmet — CRUD Server",
    description="""
Direct database access server structured using MVC.

## Public endpoints
- **GET /ops/menu/dishes** — Lists all menu dishes

## Internal endpoints (used by the BL server)
- **GET /ops/ingredients/{sku_code}** — Returns base ingredient data
    """,
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dish_router)
app.include_router(ingredient_router)


@app.get("/", tags=["Info"])
def root():
    return {
        "service":     "CRUD Server — Biconoirs Gourmet",
        "status":      "ok",
        "swagger_ui":  "/docs",
        "port":        os.getenv("PORT", "3000"),
    }


@app.get("/health", tags=["Info"])
def health():
    return {"status": "ok", "server": "crud"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=int(os.getenv("PORT", 3000)), reload=False)
    