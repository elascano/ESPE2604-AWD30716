from contextlib import asynccontextmanager
from fastapi import FastAPI
from beanie import init_beanie
from app.database import db
from app.models.invoice import Invoice
from app.controllers.invoice_controller import router as invoice_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_beanie(database=db, document_models=[Invoice])
    yield

app = FastAPI(title="Invoice API", version="1.0.0", lifespan=lifespan)
app.include_router(invoice_router)
