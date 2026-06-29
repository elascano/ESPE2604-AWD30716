from fastapi import FastAPI
from app.controllers.order_controller import router as order_router

app = FastAPI(title="Orders API", version="1.0.0")
app.include_router(order_router)
