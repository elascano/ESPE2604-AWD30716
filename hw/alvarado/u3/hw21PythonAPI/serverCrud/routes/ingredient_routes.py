from fastapi import APIRouter
from controllers.ingredient_controller import IngredientController

router = APIRouter(prefix="/ops/ingredients", tags=["Ingredients — Business logic"])


@router.get(
    "/{sku_code}",
    summary="Get ingredient by SKU",
    description="Internal use: called by the BL server to retrieve base ingredient data."
)
def get_ingredient(sku_code: str):
    return IngredientController.get_by_sku(sku_code)
