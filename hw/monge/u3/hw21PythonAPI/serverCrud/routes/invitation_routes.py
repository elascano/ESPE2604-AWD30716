from fastapi import APIRouter, status
from typing import List, Optional
from models.invitation_model import InvitationCreateBody, InvitationResponse
from controllers.invitation_controller import InvitationController

router = APIRouter(prefix="/invitation-codes", tags=["Invitations CRUD"])

@router.post("", response_model=InvitationResponse, status_code=status.HTTP_201_CREATED)
def create_invitation(body: InvitationCreateBody):
    """
    Ruta para insertar un código de invitación (CRUD Insert).
    """
    return InvitationController.create_invitation(body)

@router.get("", response_model=List[InvitationResponse])
def get_invitations(barbershop_id: Optional[str] = None):
    """
    Ruta para obtener códigos de invitación (CRUD Select).
    """
    return InvitationController.get_invitations(barbershop_id)
