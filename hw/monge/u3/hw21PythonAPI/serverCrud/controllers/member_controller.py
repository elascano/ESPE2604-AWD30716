from typing import List, Optional
from models.database import MEMBERS_DB

class MemberController:
    @staticmethod
    def get_members(barbershop_id: Optional[str] = None, user_id: Optional[str] = None) -> List[dict]:
        """
        Consulta lógica de la lista de miembros filtrados por barbería y usuario.
        """
        results = MEMBERS_DB
        if barbershop_id:
            results = [m for m in results if m["barbershop_id"] == barbershop_id]
        if user_id:
            results = [m for m in results if m["user_id"] == user_id]
        return results
