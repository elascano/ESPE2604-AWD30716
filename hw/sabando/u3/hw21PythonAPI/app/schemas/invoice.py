from datetime import datetime
from typing import Optional, Any
from pydantic import BaseModel, ConfigDict

class InvoiceCreate(BaseModel):
    id: Optional[str] = None
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

class InvoiceUpdate(BaseModel):
    issuerName: Optional[str] = None
    issuerCommercialName: Optional[str] = None
    issuerAddress: Optional[str] = None
    issuerRuc: Optional[str] = None
    number: Optional[str] = None
    authorizationNumber: Optional[str] = None
    emissionType: Optional[str] = None
    accessKey: Optional[str] = None
    customerName: Optional[str] = None
    customerId: Optional[str] = None
    customerDate: Optional[str] = None
    customerAddress: Optional[str] = None
    customerPhone: Optional[str] = None
    customerEmail: Optional[str] = None
    products: Optional[Any] = None
    subtotal: Optional[float] = None
    iva: Optional[float] = None
    total: Optional[float] = None
    type: Optional[str] = None
    format: Optional[str] = None
    userId: Optional[str] = None
    workspaceId: Optional[str] = None

class InvoiceResponse(BaseModel):
    id: str
    issuerName: str
    issuerCommercialName: Optional[str] = None
    issuerAddress: Optional[str] = None
    issuerRuc: str
    number: str
    authorizationNumber: str
    emissionType: str
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
    type: str
    format: str
    userId: str
    workspaceId: Optional[str] = None
    createdAt: datetime

    model_config = ConfigDict(from_attributes=True)
