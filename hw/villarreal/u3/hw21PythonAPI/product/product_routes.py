from fastapi import APIRouter, Depends, status, Query
from sqlmodel import Session
from typing import Optional
from .database import get_session
from .models import ProductCreate, ProductUpdate, ProductUpdateStock
from .product_controller import product_controller

product_router = APIRouter()

@product_router.get("/")
def get_all(categoryId: Optional[int] = Query(None), session: Session = Depends(get_session)):
    return product_controller.get_all(session, categoryId)

@product_router.get("/{product_id}")
def get_by_id(product_id: int, session: Session = Depends(get_session)):
    return product_controller.get_by_id(session, product_id)

@product_router.post("/", status_code=status.HTTP_201_CREATED)
def create(product_data: ProductCreate, session: Session = Depends(get_session)):
    return product_controller.create(session, product_data)

@product_router.put("/{product_id}")
def update(product_id: int, product_data: ProductUpdate, session: Session = Depends(get_session)):
    return product_controller.update(session, product_id, product_data)

@product_router.patch("/{product_id}/stock")
def update_stock(product_id: int, stock_data: ProductUpdateStock, session: Session = Depends(get_session)):
    return product_controller.update_stock(session, product_id, stock_data)

@product_router.delete("/{product_id}")
def remove(product_id: int, session: Session = Depends(get_session)):
    return product_controller.remove(session, product_id)
