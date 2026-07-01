from fastapi import APIRouter
from typing import List, Optional
from models.member_model import MemberResponse
from controllers.member_controller import MemberController

router = APIRouter(prefix="/members", tags=["Members CRUD"])

@router.get("", response_model=List[MemberResponse])
def get_members(
    barbershop_id: Optional[str] = None,
    user_id: Optional[str] = None
):
    """
    Ruta para listar miembros (CRUD Select).
    """
    return MemberController.get_members(barbershop_id=barbershop_id, user_id=user_id)
