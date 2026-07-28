import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="Project Business API", port=8001, root_path="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

import os
CRUD_API_URL = os.getenv("CRUD_API_URL", "http://localhost:3000")

class OrderItemCreate(BaseModel):
    product_id: str
    quantity: int
    unit_price: float

class OrderCreate(BaseModel):
    delivery_address: str
    notes: Optional[str] = None
    items: List[OrderItemCreate]
    total: float


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
