from typing import Optional
from sqlmodel import Field, SQLModel

class ProductBase(SQLModel):
    name: str
    description: Optional[str] = None
    price: float
    stock: int = 0
    status: str = "active"
    allowsCustomization: bool = False
    categoryId: int

class Product(ProductBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

class ProductCreate(ProductBase):
    pass

class ProductUpdate(SQLModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    stock: Optional[int] = None
    status: Optional[str] = None
    allowsCustomization: Optional[bool] = None
    categoryId: Optional[int] = None

class ProductUpdateStock(SQLModel):
    stock: int
