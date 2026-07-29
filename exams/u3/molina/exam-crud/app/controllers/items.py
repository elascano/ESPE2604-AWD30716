from datetime import date, datetime, time, timezone
from decimal import Decimal

from fastapi import APIRouter, HTTPException, Query, Response, status

from app.database import db
from app.schemas.item import ItemCreate, ItemResponse, ItemUpdate

router = APIRouter(prefix="/items", tags=["Items - CRUD"])


def to_database_datetime(value: date) -> datetime:
    """Convierte una fecha sin hora al formato DateTime usado por Prisma."""
    return datetime.combine(value, time.min, tzinfo=timezone.utc)


def serialize_item(item) -> dict:
    expiration_date = item.expiration_date
    if isinstance(expiration_date, datetime):
        expiration_date = expiration_date.date()

    return {
        "id": item.id,
        "name": item.name,
        "price": float(item.price),
        "stock": item.stock,
        "expiration_date": expiration_date,
        "created_at": item.created_at,
    }


@router.get("/search", response_model=list[ItemResponse])
async def search_items(
    q: str = Query(default="", max_length=100, description="Texto parcial del nombre"),
):
    """Busca productos por coincidencia parcial del nombre."""
    items = await db.item.find_many(order={"name": "asc"})
    normalized_query = q.strip().casefold()

    if not normalized_query:
        return [serialize_item(item) for item in items]

    return [
        serialize_item(item)
        for item in items
        if normalized_query in item.name.casefold()
    ]


@router.get("", response_model=list[ItemResponse])
async def list_items():
    items = await db.item.find_many(order={"name": "asc"})
    return [serialize_item(item) for item in items]


@router.get("/{item_id}", response_model=ItemResponse)
async def get_item(item_id: str):
    item = await db.item.find_unique(where={"id": item_id})
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return serialize_item(item)


@router.post("", response_model=ItemResponse, status_code=status.HTTP_201_CREATED)
async def create_item(body: ItemCreate):
    item = await db.item.create(
        data={
            "name": body.name.strip(),
            "price": Decimal(str(body.price)),
            "stock": body.stock,
            "expiration_date": to_database_datetime(body.expiration_date),
        }
    )
    return serialize_item(item)


@router.put("/{item_id}", response_model=ItemResponse)
async def update_item(item_id: str, body: ItemUpdate):
    current = await db.item.find_unique(where={"id": item_id})
    if current is None:
        raise HTTPException(status_code=404, detail="Item not found")

    data = body.model_dump(exclude_unset=True)
    if "name" in data:
        data["name"] = data["name"].strip()
    if "price" in data:
        data["price"] = Decimal(str(data["price"]))
    if "expiration_date" in data:
        data["expiration_date"] = to_database_datetime(data["expiration_date"])

    item = await db.item.update(where={"id": item_id}, data=data)
    return serialize_item(item)


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_item(item_id: str):
    current = await db.item.find_unique(where={"id": item_id})
    if current is None:
        raise HTTPException(status_code=404, detail="Item not found")

    await db.item.delete(where={"id": item_id})
    return Response(status_code=status.HTTP_204_NO_CONTENT)
