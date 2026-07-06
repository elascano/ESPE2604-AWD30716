import uuid
from beanie import Document
from datetime import datetime
from pydantic import Field
from typing import Optional, Any

class Invoice(Document):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    issuerName: str
    issuerCommercialName: Optional[str] = None
    issuerAddress: Optional[str] = None
    issuerRuc: str
    number: str
    authorizationNumber: str
    emissionType: str = "Normal"
    accessKey: str
    customerName: str
    customerId: str
    customerDate: str
    customerAddress: Optional[str] = None
    customerPhone: Optional[str] = None
    customerEmail: Optional[str] = None
    products: Any
    subtotal: float
    iva: float
    total: float
    type: str = "COMPRA"
    format: str = "XML"
    userId: str
    workspaceId: Optional[str] = None
    createdAt: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "invoices"
