from fastapi import APIRouter
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import AsyncSessionLocal
from app.models.command import CommandLog
from datetime import datetime

router = APIRouter()

@router.post("/api/command/{command_id}/ack")
async def command_ack(command_id: str):
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(CommandLog).where(CommandLog.command_id == command_id))
        command = result.scalar_one_or_none()
        if command:
            command.acknowledged = True
            command.acknowledged_at = datetime.utcnow()
            await db.commit()
            return {"status": "ok", "message": "تأیید شد"}
        return {"status": "error", "message": "فرمان یافت نشد"}, 404
