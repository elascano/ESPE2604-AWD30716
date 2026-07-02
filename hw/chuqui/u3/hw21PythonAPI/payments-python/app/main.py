import os
from dotenv import load_dotenv
from fastapi import FastAPI

from app.routers import payments_business, payments_crud

load_dotenv()

app = FastAPI(
    title="Fábula Dental — Payments API (Python)",
    description=(
        "REST API for the Payments module of Fábula Dental. "
        "Built with **FastAPI** (framework) + **SQLAlchemy** (ORM).\n\n"
        "## Payment Rules\n"
        "- `patientID`: exactly 10 numeric digits\n"
        "- `paymentType`: `Deposit` or `Final`\n"
        "- `paymentMethod`: `Cash`, `Card`, or `Transfer`\n"
        "- `amount`: must be greater than 0\n"
        "- `date`: cannot be in the future\n"
        "- Status is auto-calculated: `Final` → `Completed`, `Deposit` → `Partial`"
    ),
    version="1.0.0",
)

app.include_router(payments_business.router)
app.include_router(payments_crud.router)


@app.get("/", tags=["Health"])
def root():
    return {
        "service": "Fábula Dental Payments API",
        "status": "running",
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc",
    }
