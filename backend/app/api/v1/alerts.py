from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.alert import AlertRule
from pydantic import BaseModel

router = APIRouter()

class AlertCreate(BaseModel):
    name: str
    sensor_type: str
    operator: str
    threshold: float
    sms_template: str

@router.get("/")
async def get_alerts(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(AlertRule).where(AlertRule.user_id == user.id)
    )
    alerts = result.scalars().all()
    
    return [
        {
            "id": a.id,
            "name": a.name,
            "enabled": a.enabled,
            "sensor_type": a.sensor_type,
            "operator": a.operator,
            "threshold": a.threshold,
            "sms_template": a.sms_template,
            "last_sent_at": a.last_sent_at.isoformat() if a.last_sent_at else None,
            "created_at": a.created_at.isoformat() if a.created_at else None
        }
        for a in alerts
    ]

@router.post("/")
async def create_alert(
    data: AlertCreate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    alert = AlertRule(
        user_id=user.id,
        name=data.name,
        sensor_type=data.sensor_type,
        operator=data.operator,
        threshold=data.threshold,
        sms_template=data.sms_template,
        enabled=True
    )
    db.add(alert)
    await db.commit()
    await db.refresh(alert)
    
    return {"id": alert.id, "message": "قانون هشدار ایجاد شد"}

@router.post("/{alert_id}/toggle")
async def toggle_alert(
    alert_id: int,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(AlertRule).where(
            AlertRule.id == alert_id,
            AlertRule.user_id == user.id
        )
    )
    alert = result.scalar_one_or_none()
    if not alert:
        raise HTTPException(status_code=404, detail="قانون هشدار یافت نشد")
    
    alert.enabled = not alert.enabled
    await db.commit()
    
    return {"id": alert.id, "enabled": alert.enabled}

@router.delete("/{alert_id}")
async def delete_alert(
    alert_id: int,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(AlertRule).where(
            AlertRule.id == alert_id,
            AlertRule.user_id == user.id
        )
    )
    alert = result.scalar_one_or_none()
    if not alert:
        raise HTTPException(status_code=404, detail="قانون هشدار یافت نشد")
    
    await db.delete(alert)
    await db.commit()
    
    return {"message": "قانون هشدار حذف شد"}
