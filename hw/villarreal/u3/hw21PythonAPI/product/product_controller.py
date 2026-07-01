from fastapi import HTTPException
from sqlmodel import Session
from typing import Optional
from .models import ProductCreate, ProductUpdate, ProductUpdateStock
from .product_repository import product_repository

class ProductController:
    def get_all(self, session: Session, categoryId: Optional[int] = None):
        products = product_repository.find_all(session, categoryId)
        return {"success": True, "data": products}

    def get_by_id(self, session: Session, product_id: int):
        product = product_repository.find_by_id(session, product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        return {"success": True, "data": product}

    def create(self, session: Session, product_data: ProductCreate):
        product = product_repository.create(session, product_data)
        return {"success": True, "data": product}

    def update(self, session: Session, product_id: int, product_data: ProductUpdate):
        product = product_repository.update(session, product_id, product_data)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        return {"success": True, "data": product}

    def update_stock(self, session: Session, product_id: int, stock_data: ProductUpdateStock):
        product = product_repository.update_stock(session, product_id, stock_data.stock)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        return {"success": True, "data": product}

    def remove(self, session: Session, product_id: int):
        success = product_repository.remove(session, product_id)
        if not success:
            raise HTTPException(status_code=404, detail="Product not found")
        return {"success": True, "message": "Product deleted"}

product_controller = ProductController()
