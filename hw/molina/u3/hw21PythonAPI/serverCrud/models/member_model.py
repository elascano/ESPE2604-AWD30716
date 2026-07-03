from pydantic import BaseModel

class MemberResponse(BaseModel):
    id: str
    barbershop_id: str
    user_id: str
    role: str
    status: str
