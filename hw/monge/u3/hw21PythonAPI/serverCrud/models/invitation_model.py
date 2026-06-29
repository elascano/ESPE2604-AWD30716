from pydantic import BaseModel

class InvitationCreateBody(BaseModel):
    barbershop_id: str
    code: str
    expires_at: str
    is_active: bool

class InvitationResponse(BaseModel):
    id: str
    barbershop_id: str
    code: str
    expires_at: str
    is_active: bool
