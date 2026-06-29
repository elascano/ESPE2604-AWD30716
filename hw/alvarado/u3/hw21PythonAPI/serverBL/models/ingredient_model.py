from pydantic import BaseModel
from typing import Optional


class IngredientDetailResponse(BaseModel):
    # Base data (retrieved from the CRUD server)
    sku_code: str
    name: str
    category: Optional[str] = None
    description: Optional[str] = None
    unit_of_measurement: str
    unit_cost: float

    # Inventory data + applied business rule
    current_stock: Optional[float] = None
    reorder_level: Optional[float] = None
    stock_percentage: Optional[float] = None
    stock_status: str   # "OK" | "LOW" | "CRITICAL" | "OUT_OF_STOCK"
    supplier: Optional[str] = None
    expiry_date: Optional[str] = None
