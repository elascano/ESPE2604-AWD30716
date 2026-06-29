from fastapi import APIRouter
from models.ingredient_model import IngredientDetailResponse
from controllers.ingredient_bl_controller import IngredientBLController

router = APIRouter(prefix="/ops/ingredients", tags=["Ingredients — Business Logic"])


@router.get(
    "/{sku_code}",
    response_model=IngredientDetailResponse,
    summary="Get ingredient with stock analysis",
    description="""
Retrieves complete ingredient data by applying the stock classification business rule.

**Internal flow:**
1. Query the CRUD server → base ingredient data
2. Query the `inventory` table → current stock and reorder level
3. Apply business rule → classify stock status:

| stock_status     | Condition                           |
|------------------|-------------------------------------|
| `OK`             | Stock ≥ 75% of reorder level        |
| `LOW`            | Stock between 25% and 74%           |
| `CRITICAL`       | Stock < 25% of reorder level        |
| `OUT_OF_STOCK`   | No inventory record exists          |
    """
)
async def get_ingredient_detail(sku_code: str):
    return await IngredientBLController.get_ingredient_detail(sku_code)
