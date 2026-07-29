from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.config import settings
from app.controllers.items import router as items_router
from app.database import connect_db, disconnect_db, db


@asynccontextmanager
async def lifespan(_: FastAPI):
    await connect_db()
    try:
        yield
    finally:
        await disconnect_db()


app = FastAPI(
    title="Exam CRUD API",
    version="1.0.0",
    description="Data access service. It is the only service that talks to the database.",
    lifespan=lifespan,
)

app.include_router(items_router)


@app.get("/", tags=["System"])
async def root():
    return {"message": "CRUD API running", "docs": "/docs"}


@app.get("/health", tags=["System"])
async def health():
    return {
        "status": "healthy",
        "service": "crud",
        "database_connected": db.is_connected(),
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.PORT)
