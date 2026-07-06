from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from beanie import init_beanie
from app.database import db
from app.models.invoice import Invoice
from app.controllers.invoice_controller import router as invoice_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_beanie(database=db, document_models=[Invoice])
    yield

app = FastAPI(title="Invoice API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(invoice_router)
