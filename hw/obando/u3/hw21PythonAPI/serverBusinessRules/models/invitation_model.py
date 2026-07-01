from pydantic import BaseModel, Field
from typing import Optional

class InvitationCreate(BaseModel):
    days_valid: Optional[int] = Field(default=7, ge=1, le=30)

class InvitationResponse(BaseModel):
    id: str
    barbershop_id: str
    code: str
    expires_at: str
    is_active: bool
