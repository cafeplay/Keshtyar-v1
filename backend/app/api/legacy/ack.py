from fastapi import APIRouter
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.command import CommandLog
from datetime import datetime

router = APIRouter()

@router.post("/api/command/{command_id}/ack")
def command_ack(command_id: str):
    db = SessionLocal()
    try:
        command = db.query(CommandLog).filter(CommandLog.command_id == command_id).first()
        if command:
            command.acknowledged = True
            command.acknowledged_at = datetime.utcnow()
            db.commit()
            return {"status": "ok", "message": "تأیید شد"}
        return {"status": "error", "message": "فرمان یافت نشد"}, 404
    finally:
        db.close()
