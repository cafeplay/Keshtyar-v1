from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.sensor import SensorData
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/")
def get_history(
    days: int = Query(7, ge=1, le=90),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    since = datetime.utcnow() - timedelta(days=days)
    
    data = db.query(SensorData).filter(
        SensorData.user_id == user.id,
        SensorData.timestamp >= since,
        SensorData.soil_moisture.isnot(None)
    ).order_by(SensorData.timestamp.asc()).all()
    
    return [
        {
            "timestamp": d.timestamp.isoformat(),
            "temperature": d.temperature,
            "humidity": d.humidity,
            "soil_moisture": d.soil_moisture,
            "tank_level": d.tank_level_percent,
            "tank_liters": d.tank_liters
        }
        for d in data
    ]

@router.get("/range")
def get_history_range(
    from_date: str = Query(..., description="YYYY-MM-DD"),
    to_date: str = Query(..., description="YYYY-MM-DD"),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        from_dt = datetime.fromisoformat(from_date)
        to_dt = datetime.fromisoformat(to_date) + timedelta(days=1)
    except ValueError:
        from_dt = datetime.utcnow() - timedelta(days=7)
        to_dt = datetime.utcnow()
    
    data = db.query(SensorData).filter(
        SensorData.user_id == user.id,
        SensorData.timestamp >= from_dt,
        SensorData.timestamp <= to_dt,
        SensorData.soil_moisture.isnot(None)
    ).order_by(SensorData.timestamp.asc()).all()
    
    return [
        {
            "timestamp": d.timestamp.isoformat(),
            "temperature": d.temperature,
            "humidity": d.humidity,
            "soil_moisture": d.soil_moisture,
            "tank_level": d.tank_level_percent,
            "tank_liters": d.tank_liters
        }
        for d in data
    ]
