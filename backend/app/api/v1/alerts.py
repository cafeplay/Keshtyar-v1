from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
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
def get_alerts(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    alerts = db.query(AlertRule).filter(AlertRule.user_id == user.id).all()
    
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
def create_alert(
    data: AlertCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
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
    db.commit()
    db.refresh(alert)
    
    return {"id": alert.id, "message": "قانون هشدار ایجاد شد"}

@router.post("/{alert_id}/toggle")
def toggle_alert(
    alert_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    alert = db.query(AlertRule).filter(AlertRule.id == alert_id, AlertRule.user_id == user.id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="قانون هشدار یافت نشد")
    
    alert.enabled = not alert.enabled
    db.commit()
    
    return {"id": alert.id, "enabled": alert.enabled}

@router.delete("/{alert_id}")
def delete_alert(
    alert_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    alert = db.query(AlertRule).filter(AlertRule.id == alert_id, AlertRule.user_id == user.id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="قانون هشدار یافت نشد")
    
    db.delete(alert)
    db.commit()
    
    return {"message": "قانون هشدار حذف شد"}
