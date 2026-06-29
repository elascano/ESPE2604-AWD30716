from pydantic import BaseModel
from typing import Optional


class DishResponse(BaseModel):
    item_id: str
    name: str
    description: Optional[str] = None
    price: float
    category_name: Optional[str] = None
    is_available: bool
    created_at: str


class IngredientResponse(BaseModel):
    sku_code: str
    name: str
    category: Optional[str] = None
    description: Optional[str] = None
    unit_of_measurement: str
    unit_cost: float
