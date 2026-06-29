from datetime import datetime
from decimal import Decimal
from typing import Optional, List
from pydantic import BaseModel, ConfigDict

class OrderItemResponse(BaseModel):
    id: int
    item_id: str
    quantity: int
    price_at_purchase: Decimal

    model_config = ConfigDict(from_attributes=True)

class OrderCreate(BaseModel):
    order_id: str
    user_id: Optional[str] = None
    total_amount: Decimal
    status: Optional[str] = None
    delivery_type: str
    delivery_address: Optional[str] = None
    special_instructions: Optional[str] = None


class OrderUpdate(BaseModel):
    user_id: Optional[str] = None
    total_amount: Optional[Decimal] = None
    status: Optional[str] = None
    delivery_type: Optional[str] = None
    delivery_address: Optional[str] = None
    special_instructions: Optional[str] = None


class OrderResponse(BaseModel):
    order_id: str
    user_id: Optional[str] = None
    total_amount: Decimal
    status: Optional[str] = None
    delivery_type: str
    delivery_address: Optional[str] = None
    special_instructions: Optional[str] = None
    created_at: Optional[datetime] = None
    items: List[OrderItemResponse] = []

    model_config = ConfigDict(from_attributes=True)