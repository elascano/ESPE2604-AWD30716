import re

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.payment import CalculateStatusRequest
import app.crud.payment as crud
from app.business.payment_logic import (
    build_payment_history,
    get_payments_for_patient,
    calculate_revenue_summary,
    calculate_method_breakdown,
    get_pending_balances,
    compute_payment_status,
)

router = APIRouter(
    prefix="/fabuladental/payments",
    tags=["Payments — Business Logic"],
)


@router.get("/history", summary="Get Payment History")
def get_payment_history(db: Session = Depends(get_db)):
    payments = crud.get_all_payments(db)
    return build_payment_history(payments)


@router.get("/revenue-summary", summary="Get Revenue Summary")
def get_revenue_summary(db: Session = Depends(get_db)):
    payments = crud.get_all_payments(db)
    return calculate_revenue_summary(payments)


@router.get("/method-breakdown", summary="Get Payment Method Breakdown")
def get_method_breakdown(db: Session = Depends(get_db)):
    payments = crud.get_all_payments(db)
    return calculate_method_breakdown(payments)


@router.get("/pending-balances", summary="Get Pending Balances")
def get_pending_balances_endpoint(db: Session = Depends(get_db)):
    payments = crud.get_all_payments(db)
    return get_pending_balances(payments)


@router.get("/patients/{patient_id}", summary="Get Payments by Patient")
def get_payments_by_patient(patient_id: str, db: Session = Depends(get_db)):
    if not re.match(r"^[0-9]{10}$", patient_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid Patient ID parameter. Must be exactly 10 numeric digits."
        )

    payments = crud.get_all_payments(db)
    result = get_payments_for_patient(payments, patient_id)

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Patient not found or no payment records discovered."
        )

    return {"success": True, "data": result}


@router.post("/calculate-status", summary="Calculate Payment Status")
def calculate_status_endpoint(request: CalculateStatusRequest):
    return compute_payment_status(request.paymentType)
