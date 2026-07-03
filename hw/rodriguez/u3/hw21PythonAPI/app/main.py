from contextlib import asynccontextmanager
from fastapi import FastAPI
from beanie import init_beanie
from app.database import db
from app.models.order import Order
from app.controllers.order_controller import router as order_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_beanie(database=db, document_models=[Order])
    yield

app = FastAPI(title="Orders API", version="1.0.0", lifespan=lifespan)
app.include_router(order_router)
