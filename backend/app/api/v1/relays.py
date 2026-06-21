from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.relay import Relay
from app.models.command import CommandLog
from pydantic import BaseModel
import json
import uuid

router = APIRouter()

class RelayCreate(BaseModel):
    name: str
    gpio: int
    mode: str = "manual"

@router.get("/")
async def get_relays(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Relay).where(Relay.user_id == user.id))
    relays = result.scalars().all()
    return [
        {
            "id": str(r.id),
            "name": r.name,
            "gpio": r.gpio,
            "state": r.state,
            "mode": getattr(r, "mode", "manual")
        }
        for r in relays
    ]

@router.post("/")
async def create_relay(
    data: RelayCreate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if data.gpio not in [12, 13, 14, 15]:
        raise HTTPException(status_code=400, detail="GPIO مجاز: 12, 13, 14, 15")
    
    result = await db.execute(
        select(Relay).where(
            Relay.user_id == user.id,
            Relay.gpio == data.gpio
        )
    )
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="این GPIO قبلاً استفاده شده است")
    
    relay = Relay(
        user_id=user.id,
        name=data.name,
        gpio=data.gpio,
        state=False,
        mode=data.mode
    )
    db.add(relay)
    await db.commit()
    await db.refresh(relay)
    
    return {
        "id": str(relay.id),
        "name": relay.name,
        "gpio": relay.gpio,
        "state": relay.state,
        "mode": relay.mode
    }

@router.post("/{relay_id}/toggle")
async def toggle_relay(
    relay_id: int,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Relay).where(
            Relay.id == relay_id,
            Relay.user_id == user.id
        )
    )
    relay = result.scalar_one_or_none()
    if not relay:
        raise HTTPException(status_code=404, detail="رله یافت نشد")
    
    new_state = not relay.state
    relay.state = new_state
    await db.commit()
    
    command_id = str(uuid.uuid4())
    command = CommandLog(
        user_id=user.id,
        command_id=command_id,
        command_type="relay_set",
        payload=json.dumps({"gpio": relay.gpio, "state": new_state}),
        acknowledged=False
    )
    db.add(command)
    await db.commit()
    
    return {
        "id": str(relay.id),
        "state": relay.state,
        "command_id": command_id
    }

@router.delete("/{relay_id}")
async def delete_relay(
    relay_id: int,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Relay).where(
            Relay.id == relay_id,
            Relay.user_id == user.id
        )
    )
    relay = result.scalar_one_or_none()
    if not relay:
        raise HTTPException(status_code=404, detail="رله یافت نشد")
    
    await db.delete(relay)
    await db.commit()
    
    return {"message": "رله حذف شد"}
