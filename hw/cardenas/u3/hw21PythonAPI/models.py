from datetime import date, datetime
from decimal import Decimal
from typing import Optional
from sqlmodel import SQLModel, Field
from pydantic import BaseModel


class Supply(SQLModel, table=True):
    __tablename__ = "supplies"

    id: Optional[int] = Field(default=None, primary_key=True)
    supplyName: str
    quantity: int = Field(default=0)
    unitCost: Decimal
    orderDate: date
    expirationDate: date
    status: str = Field(default="Current")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class SupplyRequest(BaseModel):
    supplyName: str
    quantity: int
    unitCost: Decimal
    orderDate: date
    expirationDate: date