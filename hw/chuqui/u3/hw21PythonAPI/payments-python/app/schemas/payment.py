import re
from datetime import date, datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, field_validator, ConfigDict

VALID_PAYMENT_TYPES = ["Deposit", "Final"]
VALID_PAYMENT_METHODS = ["Cash", "Card", "Transfer"]


class PaymentBase(BaseModel):
    patientID: str
    amount: Decimal
    date: date
    paymentType: str
    paymentMethod: str


class PaymentCreate(PaymentBase):
    @field_validator("patientID")
    @classmethod
    def validate_patient_id(cls, v: str) -> str:
        v = v.strip()
        if not re.match(r"^[0-9]{10}$", v):
            raise ValueError("patientID must be exactly 10 numeric digits")
        return v

    @field_validator("amount")
    @classmethod
    def validate_amount(cls, v: Decimal) -> Decimal:
        if v <= 0:
            raise ValueError("amount must be greater than 0")
        return v

    @field_validator("paymentType")
    @classmethod
    def validate_payment_type(cls, v: str) -> str:
        if v not in VALID_PAYMENT_TYPES:
            raise ValueError(f"paymentType must be one of: {VALID_PAYMENT_TYPES}")
        return v

    @field_validator("paymentMethod")
    @classmethod
    def validate_payment_method(cls, v: str) -> str:
        if v not in VALID_PAYMENT_METHODS:
            raise ValueError(f"paymentMethod must be one of: {VALID_PAYMENT_METHODS}")
        return v

    @field_validator("date")
    @classmethod
    def validate_date_not_future(cls, v: date) -> date:
        if v > date.today():
            raise ValueError("date cannot be in the future")
        return v


class PaymentUpdate(PaymentCreate):
    pass


class PaymentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    patientID: str
    amount: float
    date: date
    paymentType: str
    paymentMethod: str
    status: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class CalculateStatusRequest(BaseModel):
    paymentType: str

    @field_validator("paymentType")
    @classmethod
    def validate_payment_type(cls, v: str) -> str:
        if v not in VALID_PAYMENT_TYPES:
            raise ValueError(f"paymentType must be one of: {VALID_PAYMENT_TYPES}")
        return v
