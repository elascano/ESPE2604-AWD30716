from datetime import datetime
from typing import Literal
from decimal import Decimal
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlmodel import Session, select

from database import get_db
from models import Supply, SupplyRequest 

router = APIRouter()

def clean_date(raw_date):
    text_date = str(raw_date)
    if "T" in text_date:
        text_date = text_date.split("T")[0]
    return text_date


@router.get("/supplies")
def get_supplies(db: Session = Depends(get_db)):
    try:
        inventory = db.exec(select(Supply)).all()
        return inventory
    except Exception:
        return JSONResponse(status_code=500, content={"error": "Unable to fetch inventory."})


@router.get("/supplies/quantity-thresholds/{maxQuantity}")
def get_supplies_quantity_thresholds(maxQuantity: int, db: Session = Depends(get_db)):
    try:
        inventory = db.exec(select(Supply).where(Supply.quantity <= maxQuantity)).all()
        return inventory
    except Exception:
        return JSONResponse(status_code=500, content={"error": "Database error while filtering supply quantities."})


@router.get("/supplies/statuses/{statusValue}")
def get_supplies_statuses(statusValue: Literal["Expired", "NextExpiration", "Current"], db: Session = Depends(get_db)):
    try:
        inventory = db.exec(select(Supply).where(Supply.status == statusValue)).all()
        return inventory
    except Exception:
        return JSONResponse(status_code=500, content={"error": "Database error while filtering supply statuses."})


@router.post("/supply")
def create_supply(data: SupplyRequest, db: Session = Depends(get_db)):
    if not data.supplyName or data.quantity is None or data.unitCost is None or not data.orderDate or not data.expirationDate:
        return JSONResponse(status_code=400, content={"error": "Missing supply data."})

    try:
        new_supply = Supply(
            supplyName=data.supplyName,
            quantity=data.quantity,
            unitCost=data.unitCost,
            orderDate=clean_date(data.orderDate),
            expirationDate=clean_date(data.expirationDate),
            status="Current"
        )
        db.add(new_supply)
        db.commit()
        return JSONResponse(status_code=201, content={"success": True, "message": "Supply added"})
    except Exception:
        return JSONResponse(status_code=400, content={"error": "Missing supply data."})


@router.put("/supplies/{id}")
def update_supply(id: int, data: SupplyRequest, db: Session = Depends(get_db)):
    db_supply = db.get(Supply, id)
    if not db_supply:
        return JSONResponse(status_code=404, content={"error": "Supply not found."})

    if not data.supplyName or data.quantity is None or data.unitCost is None or not data.orderDate or not data.expirationDate:
        return JSONResponse(status_code=400, content={"error": "Invalid supply ID or quantity."})

    if data.quantity < 0:
        return JSONResponse(status_code=400, content={"error": "Invalid supply ID or quantity."})

    try:
        db_supply.supplyName = data.supplyName
        db_supply.quantity = data.quantity
        db_supply.unitCost = Decimal(str(data.unitCost))
        db_supply.orderDate = clean_date(data.orderDate)
        db_supply.expirationDate = clean_date(data.expirationDate)
        db_supply.updated_at = datetime.now()

        db.add(db_supply)
        db.commit()
        return JSONResponse(status_code=200, content={"success": True, "message": "Supply updated"})
    except Exception:
        return JSONResponse(status_code=400, content={"error": "Invalid supply ID or quantity."})


@router.delete("/supplies/{id}")
def delete_supply(id: int, db: Session = Depends(get_db)):
    db_supply = db.get(Supply, id)
    if not db_supply:
        return JSONResponse(status_code=404, content={"error": "Supply not found."})

    try:
        db.delete(db_supply)
        db.commit()
        return JSONResponse(status_code=200, content={"success": True, "message": "Supply deleted"})
    except Exception:
        return JSONResponse(status_code=500, content={"error": "Deletion failed."})