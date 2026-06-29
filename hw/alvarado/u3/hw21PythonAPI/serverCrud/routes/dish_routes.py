from fastapi import APIRouter
from controllers.dish_controller import DishController

router = APIRouter(prefix="/ops/menu", tags=["Menu — CRUD"])


@router.get(
    "/dishes",
    summary="Get all menu dishes",
    description="Returns the complete list of dishes with name, price, category, and availability."
)
def get_all_dishes():
    return DishController.get_all_dishes()
