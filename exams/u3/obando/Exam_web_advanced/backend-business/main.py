import os
import httpx
from datetime import datetime
from typing import List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

class ExpirationDate(BaseModel):
    day: int
    month: int
    year: int

class ProductAnalysisRequest(BaseModel):
    products: List[dict]
    target_product: dict
    expiration: ExpirationDate

class OrderItemCreate(BaseModel):
    product_id: str
    quantity: int
    unit_price: float

class OrderCreate(BaseModel):
    delivery_address: str
    notes: Optional[str] = None
    items: List[OrderItemCreate]
    total: float

app = FastAPI(title="Project Business API", port=8001, root_path="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CRUD_API_URL = os.getenv("CRUD_API_URL", "http://localhost:3000")

@app.get("/projects/{project_id}/products")
async def get_products(project_id: str, search: Optional[str] = None):
    try:
        async with httpx.AsyncClient() as client:
            params = {"search": search} if search else {}
            response = await client.get(f"{CRUD_API_URL}/products", params=params)
            response.raise_for_status()
            return response.json()
    except httpx.RequestError as exc:
        raise HTTPException(status_code=503, detail=f"Error connecting to CRUD API: {exc}")
    except httpx.HTTPStatusError as exc:
        raise HTTPException(status_code=exc.response.status_code, detail=exc.response.text)

@app.post("/projects/{project_id}/orders")
async def create_order(project_id: str, order: OrderCreate):
    if order.total <= 0:
        raise HTTPException(status_code=400, detail="Order total must be greater than 0")
        
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(f"{CRUD_API_URL}/orders", json=order.dict())
            response.raise_for_status()
            return response.json()
    except httpx.RequestError as exc:
        raise HTTPException(status_code=503, detail=f"Error connecting to CRUD API: {exc}")
    except httpx.HTTPStatusError as exc:
        raise HTTPException(status_code=exc.response.status_code, detail=exc.response.text)

@app.get("/projects/{project_id}/products/{product_id}")
async def get_product(project_id: str, product_id: str):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{CRUD_API_URL}/products/{product_id}")
            response.raise_for_status()
            return response.json()
    except httpx.RequestError as exc:
        raise HTTPException(status_code=503, detail=f"Error connecting to CRUD API: {exc}")
    except httpx.HTTPStatusError as exc:
        raise HTTPException(status_code=exc.response.status_code, detail=exc.response.text)

@app.post("/projects/{project_id}/analyze")
async def analyze_products(project_id: str, data: ProductAnalysisRequest):
    total_price = sum(product.get("price", 0.0) * product.get("quantity", 1) for product in data.products)
    target_price = data.target_product.get("price", 0.0)
    vat_amount = target_price * 0.19

    try:
        exp_date = datetime(data.expiration.year, data.expiration.month, data.expiration.day)
        days_left = (exp_date - datetime.now()).days
    except ValueError:
        days_left = 0

    return {
        "total_price": total_price,
        "vat_amount": vat_amount,
        "days_left": days_left
    }
