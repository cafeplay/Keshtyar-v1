from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class RelayBase(BaseModel):
    name: str
    gpio: int
    mode: str = "manual"

class RelayCreate(RelayBase):
    pass

class RelayResponse(RelayBase):
    id: int
    user_id: int
    state: bool
    created_at: datetime
    
    class Config:
        from_attributes = True
