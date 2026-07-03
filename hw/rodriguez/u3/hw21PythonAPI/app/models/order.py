from beanie import Document
from datetime import datetime
from pydantic import Field, field_validator
from typing import Optional, List
from decimal import Decimal
from bson import Decimal128
from typing import Any
from app.models.order_item import OrderItem

class Order(Document):
    id: str = Field(alias="_id")
    user_id: Optional[str] = None
    total_amount: Decimal
    status: Optional[str] = None
    delivery_type: str
    delivery_address: Optional[str] = None
    special_instructions: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    items: List[OrderItem] = []

    @field_validator("total_amount", mode="before")
    @classmethod
    def convert_decimal128(cls, v: Any) -> Any:
        if isinstance(v, Decimal128):
            return v.to_decimal()
        return v

    @property
    def order_id(self) -> str:
        return self.id

    class Settings:
        name = "orders"
