from datetime import date, datetime, timezone
from decimal import Decimal, ROUND_HALF_UP

from fastapi import HTTPException, status


def validate_item(name: str, price: float, stock: int) -> None:
    if not name.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Name cannot be empty",
        )

    if price <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Price must be greater than 0",
        )

    if stock < 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Stock cannot be negative",
        )


def availability_from_stock(stock: int) -> str:
    return "available" if stock > 0 else "out_of_stock"


def calculate_vat(price: float, rate: float) -> dict:
    price_decimal = Decimal(str(price))
    rate_decimal = Decimal(str(rate))
    iva = (price_decimal * rate_decimal).quantize(
        Decimal("0.01"),
        rounding=ROUND_HALF_UP,
    )
    total = (price_decimal + iva).quantize(
        Decimal("0.01"),
        rounding=ROUND_HALF_UP,
    )

    return {
        "iva_rate": float(rate_decimal),
        "iva_value": float(iva),
        "price_with_iva": float(total),
    }


def normalize_date(value: date | datetime | str) -> date:
    if isinstance(value, datetime):
        return value.date()
    if isinstance(value, date):
        return value

    parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
    return parsed.date()


def calculate_remaining_days(expiration_date: date | datetime | str) -> int:
    """Devuelve días faltantes; un valor negativo indica que ya expiró."""
    target_date = normalize_date(expiration_date)
    current_date = datetime.now(timezone.utc).date()
    return (target_date - current_date).days
