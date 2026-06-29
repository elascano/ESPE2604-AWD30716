from fastapi import FastAPI
from routes.member_routes import router as member_router
from routes.invitation_routes import router as invitation_router

app = FastAPI(
    title="SharkHub CRUD API (MVC Simulado)",
    description="Servidor de acceso directo a datos estructurado en MVC (Puerto 3000)",
    version="1.0.0"
)

# Registrar rutas del CRUD
app.include_router(member_router)
app.include_router(invitation_router)

@app.get("/", tags=["Info"])
def read_root():
    return {
        "service": "CRUD Database API (MVC)",
        "status": "healthy",
        "port": 3000,
        "description": "Simula el acceso directo a la base de datos dividida en modelos, controladores y rutas."
    }

if __name__ == "__main__":
    import uvicorn
    # Corre en el puerto 3000
    uvicorn.run("main:app", host="0.0.0.0", port=3000, reload=True)
