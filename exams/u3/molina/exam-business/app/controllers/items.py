from fastapi import APIRouter, HTTPException, Query, Response, status

from app.clients.crud_client import crud_client
from app.config import settings
from app.schemas.item import (
    ItemCreate,
    ItemRemainingDaysResponse,
    ItemResponse,
    ItemUpdate,
    ItemVatResponse,
)
from app.services.item_rules import (
    availability_from_stock,
    calculate_remaining_days,
    calculate_vat,
    validate_item,
)

router = APIRouter(prefix="/api/v1/items", tags=["Items - Business"])


def with_business_fields(item: dict) -> dict:
    return {
        **item,
        "availability": availability_from_stock(item["stock"]),
    }


@router.get("/iva", response_model=list[ItemVatResponse])
async def search_items_with_iva(
    q: str = Query(default="", max_length=100, description="Texto parcial del nombre"),
):
    """Busca productos y devuelve el IVA calculado para cada coincidencia."""
    items = await crud_client.search_items(q)
    return [
        {
            **with_business_fields(item),
            **calculate_vat(item["price"], settings.VAT_RATE),
        }
        for item in items
    ]


@router.get("/dias-restantes", response_model=list[ItemRemainingDaysResponse])
async def search_items_with_remaining_days(
    q: str = Query(default="", max_length=100, description="Texto parcial del nombre"),
):
    """Busca productos y devuelve cuántos días faltan para su expiración."""
    items = await crud_client.search_items(q)
    return [
        {
            "id": item["id"],
            "name": item["name"],
            "expiration_date": item["expiration_date"],
            "days_remaining": calculate_remaining_days(item["expiration_date"]),
        }
        for item in items
    ]


@router.get("", response_model=list[ItemResponse])
async def list_items():
    items = await crud_client.list_items()
    return [with_business_fields(item) for item in items]


@router.get("/{item_id}", response_model=ItemResponse)
async def get_item(item_id: str):
    item = await crud_client.get_item(item_id)
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return with_business_fields(item)


@router.post("", response_model=ItemResponse, status_code=status.HTTP_201_CREATED)
async def create_item(body: ItemCreate):
    validate_item(body.name, body.price, body.stock)
    created = await crud_client.create_item(body.model_dump(mode="json"))
    return with_business_fields(created)


@router.put("/{item_id}", response_model=ItemResponse)
async def update_item(item_id: str, body: ItemUpdate):
    current = await crud_client.get_item(item_id)
    if current is None:
        raise HTTPException(status_code=404, detail="Item not found")

    merged = {**current, **body.model_dump(exclude_unset=True, mode="json")}
    validate_item(merged["name"], merged["price"], merged["stock"])

    updated = await crud_client.update_item(
        item_id,
        body.model_dump(exclude_unset=True, mode="json"),
    )
    return with_business_fields(updated)


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_item(item_id: str):
    current = await crud_client.get_item(item_id)
    if current is None:
        raise HTTPException(status_code=404, detail="Item not found")

    await crud_client.delete_item(item_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
