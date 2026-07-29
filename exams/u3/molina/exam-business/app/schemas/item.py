from datetime import date, datetime

from pydantic import BaseModel, Field


class ItemCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    price: float = Field(gt=0)
    stock: int = Field(ge=0)
    expiration_date: date


class ItemUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=100)
    price: float | None = Field(default=None, gt=0)
    stock: int | None = Field(default=None, ge=0)
    expiration_date: date | None = None


class ItemResponse(BaseModel):
    id: str
    name: str
    price: float
    stock: int
    expiration_date: date
    created_at: datetime
    availability: str


class ItemVatResponse(ItemResponse):
    iva_rate: float
    iva_value: float
    price_with_iva: float


class ItemRemainingDaysResponse(BaseModel):
    id: str
    name: str
    expiration_date: date
    days_remaining: int
