import uuid
from typing import List, Optional
from models.database import INVITATIONS_DB
from models.invitation_model import InvitationCreateBody

class InvitationController:
    @staticmethod
    def create_invitation(body: InvitationCreateBody) -> dict:
        """
        Inserta un nuevo código de invitación en la base de datos simulada.
        """
        record = {
            "id": f"inv_{uuid.uuid4().hex[:8]}",
            "barbershop_id": body.barbershop_id,
            "code": body.code,
            "expires_at": body.expires_at,
            "is_active": body.is_active
        }
        INVITATIONS_DB.append(record)
        return record

    @staticmethod
    def get_invitations(barbershop_id: Optional[str] = None) -> List[dict]:
        """
        Consulta todos los códigos de invitación guardados.
        """
        results = INVITATIONS_DB
        if barbershop_id:
            results = [r for r in results if r["barbershop_id"] == barbershop_id]
        return results
