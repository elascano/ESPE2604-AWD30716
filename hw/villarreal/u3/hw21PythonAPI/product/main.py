from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import init_db
from .product_routes import product_router
import os

app = FastAPI(title="Product API", description="CRUD API for Products")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

# The proxy in Node forwards /api/product -> / here
app.include_router(product_router, tags=["Products"])
