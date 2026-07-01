import httpx
import random
import string
from datetime import datetime, timedelta
from typing import List
from fastapi import HTTPException, status
from models.invitation_model import InvitationCreate

DATABASE_API_URL = "http://localhost:3000"

class InvitationRulesController:
    @staticmethod
    def generate_invitation_code() -> str:
        """
        Genera un código aleatorio alfanumérico con formato: SH-XXX-XXX
        """
        p1 = "".join(random.choices(string.digits, k=3))
        p2 = "".join(random.choices(string.ascii_uppercase, k=3))
        return f"SH-{p1}-{p2}"

    @staticmethod
    async def check_is_barbershop_owner(user_id: str, barbershop_id: str):
        """
        REGLA DE NEGOCIO (RBAC): Valida si el usuario es el dueño (Owner) activo.
        """
        url = f"{DATABASE_API_URL}/members"
        params = {"barbershop_id": barbershop_id, "user_id": user_id}
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(url, params=params, timeout=5.0)
                if response.status_code != 200:
                    raise HTTPException(
                        status_code=status.HTTP_502_BAD_GATEWAY,
                        detail="Error de comunicación con la API CRUD de base de datos."
                    )
                members = response.json()
            except httpx.RequestError as e:
                raise HTTPException(
                    status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                    detail=f"La API CRUD (puerto 3000) está fuera de línea. Detalle: {str(e)}"
                )

        if not members or members[0]["role"].lower() != "owner" or members[0]["status"] != "active":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Acceso Denegado: Solo el Propietario (Owner) activo de la barbería puede realizar esta acción."
            )

    @classmethod
    async def create_invitation(cls, shop_id: str, body: InvitationCreate, x_user_id: str) -> dict:
        """
        Regla de negocio: Genera invitación y persiste los datos en el CRUD server.
        """
        # 1. Ejecutar regla de negocio RBAC
        await cls.check_is_barbershop_owner(user_id=x_user_id, barbershop_id=shop_id)
        
        # 2. Lógica del negocio
        code = cls.generate_invitation_code()
        expiration_date = datetime.now() + timedelta(days=body.days_valid)
        
        # 3. Llamar al CRUD para guardar
        crud_url = f"{DATABASE_API_URL}/invitation-codes"
        payload = {
            "barbershop_id": shop_id,
            "code": code,
            "expires_at": expiration_date.isoformat(),
            "is_active": True
        }
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(crud_url, json=payload, timeout=5.0)
                if response.status_code == 201:
                    return response.json()
                else:
                    raise HTTPException(
                        status_code=status.HTTP_502_BAD_GATEWAY,
                        detail=f"La API CRUD respondió con error {response.status_code}."
                    )
            except httpx.RequestError as e:
                raise HTTPException(
                    status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                    detail=f"La API CRUD (puerto 3000) está fuera de línea. Detalle: {str(e)}"
                )

    @classmethod
    async def list_invitations(cls, shop_id: str, x_user_id: str) -> List[dict]:
        """
        Regla de negocio: Lista las invitaciones obteniéndolas de la API CRUD.
        """
        # 1. Ejecutar regla de negocio RBAC
        await cls.check_is_barbershop_owner(user_id=x_user_id, barbershop_id=shop_id)
        
        # 2. Llamar al CRUD para consultar
        crud_url = f"{DATABASE_API_URL}/invitation-codes"
        params = {"barbershop_id": shop_id}
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(crud_url, params=params, timeout=5.0)
                if response.status_code == 200:
                    return response.json()
                else:
                    raise HTTPException(
                        status_code=status.HTTP_502_BAD_GATEWAY,
                        detail="Error al consultar datos en la API CRUD."
                    )
            except httpx.RequestError as e:
                raise HTTPException(
                    status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                    detail=f"La API CRUD (puerto 3000) está fuera de línea. Detalle: {str(e)}"
                )
