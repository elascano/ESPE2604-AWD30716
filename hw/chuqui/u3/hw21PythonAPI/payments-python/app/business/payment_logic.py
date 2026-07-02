from collections import defaultdict
from typing import Any


def calculate_status(payment: Any) -> str:
    if payment.paymentType == "Final":
        return "Completed"
    if payment.paymentType == "Deposit":
        return "Partial"
    return "Pending"


def build_payment_history(payments: list) -> list[dict]:
    return [
        {
            "paymentID": str(payment.id),
            "patientID": payment.patientID,
            "amount": float(payment.amount),
            "date": str(payment.date),
            "paymentType": payment.paymentType,
            "paymentMethod": payment.paymentMethod,
            "status": calculate_status(payment),
        }
        for payment in payments
    ]


def get_payments_for_patient(payments: list, patient_id: str) -> list[dict]:
    filtered = [p for p in payments if p.patientID == patient_id]
    return [
        {
            "id": str(p.id),
            "amount": float(p.amount),
            "type": p.paymentType,
            "method": p.paymentMethod,
            "status": calculate_status(p),
            "date": str(p.date),
        }
        for p in filtered
    ]


def calculate_revenue_summary(payments: list) -> dict:
    total_revenue = sum(float(p.amount) for p in payments)
    completed_revenue = sum(float(p.amount) for p in payments if p.paymentType == "Final")
    partial_revenue = sum(float(p.amount) for p in payments if p.paymentType == "Deposit")

    return {
        "totalRevenue": round(total_revenue, 2),
        "completedRevenue": round(completed_revenue, 2),
        "partialRevenue": round(partial_revenue, 2),
        "currency": "USD",
        "totalTransactions": len(payments),
        "completedCount": sum(1 for p in payments if p.paymentType == "Final"),
        "partialCount": sum(1 for p in payments if p.paymentType == "Deposit"),
    }


def calculate_method_breakdown(payments: list) -> dict:
    breakdown: dict = defaultdict(lambda: {"count": 0, "total": 0.0})

    for p in payments:
        breakdown[p.paymentMethod]["count"] += 1
        breakdown[p.paymentMethod]["total"] += float(p.amount)

    return {
        method: {
            "count": data["count"],
            "total": round(data["total"], 2),
            "currency": "USD",
        }
        for method, data in breakdown.items()
    }


def get_pending_balances(payments: list) -> dict:
    partial_payments = [p for p in payments if p.paymentType == "Deposit"]
    total_pending = sum(float(p.amount) for p in partial_payments)

    return {
        "totalPendingAmount": round(total_pending, 2),
        "pendingCount": len(partial_payments),
        "currency": "USD",
        "items": [
            {
                "paymentID": str(p.id),
                "patientID": p.patientID,
                "depositAmount": float(p.amount),
                "paymentMethod": p.paymentMethod,
                "date": str(p.date),
            }
            for p in partial_payments
        ],
    }


def compute_payment_status(payment_type: str) -> dict:
    status = "Completed" if payment_type == "Final" else "Partial"
    return {
        "paymentType": payment_type,
        "calculatedStatus": status,
        "description": (
            "Payment is fully settled." if status == "Completed"
            else "Payment is a deposit; remaining balance expected."
        ),
    }
