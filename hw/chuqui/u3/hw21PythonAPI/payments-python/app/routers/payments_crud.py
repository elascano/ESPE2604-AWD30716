from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.payment import PaymentCreate, PaymentUpdate, PaymentResponse
import app.crud.payment as crud

router = APIRouter(
    prefix="/fabuladental/payments",
    tags=["Payments — CRUD"],
)


@router.get("", response_model=List[PaymentResponse], summary="Get Payments")
def get_payments(db: Session = Depends(get_db)):
    return crud.get_all_payments(db)


@router.post("", status_code=201, summary="Create Payment")
def create_payment(payment: PaymentCreate, db: Session = Depends(get_db)):
    crud.create_payment(db, payment)
    return {"success": True, "message": "Payment recorded"}


@router.put("/{payment_id}", summary="Update Payment")
def update_payment(payment_id: int, payment: PaymentUpdate, db: Session = Depends(get_db)):
    result = crud.update_payment(db, payment_id, payment)
    if result is None:
        raise HTTPException(status_code=404, detail="Payment record not found.")
    return {"success": True, "message": "Payment updated"}


@router.delete("/{payment_id}", summary="Delete Payment")
def delete_payment(payment_id: int, db: Session = Depends(get_db)):
    result = crud.delete_payment(db, payment_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Payment not found.")
    return {"success": True, "message": "Payment deleted"}
