from fastapi import APIRouter, Header, status
from typing import List
from models.invitation_model import InvitationCreate, InvitationResponse
from controllers.invitation_rules_controller import InvitationRulesController

router = APIRouter(prefix="/barbershops", tags=["Invitations Logic"])

@router.post("/{shop_id}/invitations", response_model=InvitationResponse, status_code=status.HTTP_201_CREATED)
async def create_invitation(
    shop_id: str,
    body: InvitationCreate,
    x_user_id: str = Header(..., description="ID del usuario simulado que hace la petición")
):
    """
    Ruta para la creación de invitaciones aplicando la Regla de Negocio 3.
    """
    return await InvitationRulesController.create_invitation(
        shop_id=shop_id,
        body=body,
        x_user_id=x_user_id
    )

@router.get("/{shop_id}/invitations", response_model=List[InvitationResponse])
async def list_invitations(
    shop_id: str,
    x_user_id: str = Header(..., description="ID del usuario simulado que hace la petición")
):
    """
    Ruta para listar invitaciones de una barbería validando permisos de propietario.
    """
    return await InvitationRulesController.list_invitations(
        shop_id=shop_id,
        x_user_id=x_user_id
    )
