from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.database import get_db
from app.schemas.order import OrderCreate, OrderUpdate, OrderResponse
from app.repository import order_repo as repo

router = APIRouter(prefix="/orders", tags=["orders"])


@router.get("/", response_model=list[OrderResponse])
async def list_orders(db: AsyncIOMotorDatabase = Depends(get_db)):
    return await repo.find_all(db)


@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(order_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    order = await repo.find_one(db, order_id)
    if order is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return order


@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order(data: OrderCreate, db: AsyncIOMotorDatabase = Depends(get_db)):
    return await repo.create(db, data)


@router.put("/{order_id}", response_model=OrderResponse)
async def update_order(order_id: str, data: OrderUpdate, db: AsyncIOMotorDatabase = Depends(get_db)):
    order = await repo.update(db, order_id, data)
    if order is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return order


@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_order(order_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    deleted = await repo.remove(db, order_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
