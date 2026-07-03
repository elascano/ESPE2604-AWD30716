from fastapi import FastAPI
from routes.invitation_rules_routes import router as invitation_rules_router

app = FastAPI(
    title="SharkHub Business Rules API (MVC Simulado)",
    description="Servidor de Reglas de Negocio estructurado en MVC (Puerto 8000)",
    version="1.0.0"
)

# Registrar rutas de negocio
app.include_router(invitation_rules_router)

@app.get("/", tags=["Info"])
def read_root():
    return {
        "service": "Business Rules API (MVC)",
        "status": "healthy",
        "port": 8000,
        "description": "Aplica validaciones de negocio en controladores y rutas independientes."
    }

if __name__ == "__main__":
    import uvicorn
    # Corre en el puerto 8000
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
