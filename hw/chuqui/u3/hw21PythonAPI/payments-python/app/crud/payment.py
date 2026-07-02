from datetime import datetime
from typing import Optional

from sqlalchemy.orm import Session

from app.models.payment import Payment
from app.schemas.payment import PaymentCreate, PaymentUpdate


def _calculate_status(payment_type: str) -> str:
    return "Completed" if payment_type == "Final" else "Partial"


def get_all_payments(db: Session) -> list[Payment]:
    return db.query(Payment).all()


def get_payment_by_id(db: Session, payment_id: int) -> Optional[Payment]:
    return db.query(Payment).filter(Payment.id == payment_id).first()


def create_payment(db: Session, payment_data: PaymentCreate) -> Payment:
    db_payment = Payment(
        patientID=payment_data.patientID,
        amount=payment_data.amount,
        date=payment_data.date,
        paymentType=payment_data.paymentType,
        paymentMethod=payment_data.paymentMethod,
        status=_calculate_status(payment_data.paymentType),
    )
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    return db_payment


def update_payment(db: Session, payment_id: int, payment_data: PaymentUpdate) -> Optional[Payment]:
    db_payment = get_payment_by_id(db, payment_id)
    if db_payment is None:
        return None

    db_payment.patientID = payment_data.patientID
    db_payment.amount = payment_data.amount
    db_payment.date = payment_data.date
    db_payment.paymentType = payment_data.paymentType
    db_payment.paymentMethod = payment_data.paymentMethod
    db_payment.status = _calculate_status(payment_data.paymentType)
    db_payment.updated_at = datetime.now()

    db.commit()
    db.refresh(db_payment)
    return db_payment


def delete_payment(db: Session, payment_id: int) -> Optional[Payment]:
    db_payment = get_payment_by_id(db, payment_id)
    if db_payment is None:
        return None

    db.delete(db_payment)
    db.commit()
    return db_payment
