from pydantic import BaseModel, field_validator
from decimal import Decimal
from bson import Decimal128
from typing import Any

class OrderItem(BaseModel):
    id: int
    item_id: str
    quantity: int
    price_at_purchase: Decimal

    @field_validator("price_at_purchase", mode="before")
    @classmethod
    def convert_decimal128(cls, v: Any) -> Any:
        if isinstance(v, Decimal128):
            return v.to_decimal()
        return v
