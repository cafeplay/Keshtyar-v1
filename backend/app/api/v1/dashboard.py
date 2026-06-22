from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.sensor import SensorData
from app.models.relay import Relay
from app.services.weather import get_weather_forecast
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/")
def get_dashboard_data(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # آخرین داده
    last = db.query(SensorData).filter(SensorData.user_id == user.id).order_by(SensorData.timestamp.desc()).first()
    
    # تاریخچه ۲۴ ساعت
    since = datetime.utcnow() - timedelta(hours=24)
    history = db.query(SensorData).filter(
        SensorData.user_id == user.id,
        SensorData.timestamp >= since,
        SensorData.soil_moisture.isnot(None)
    ).order_by(SensorData.timestamp.asc()).all()
    
    # رله‌ها
    relays = db.query(Relay).filter(Relay.user_id == user.id).all()
    
    # آب‌وهوا
    forecast = get_weather_forecast(user.latitude, user.longitude)
    
    return {
        "temperature": last.temperature if last else None,
        "soil_moisture": last.soil_moisture if last else None,
        "tank_level": last.tank_level_percent if last else None,
        "humidity": last.humidity if last else None,
        "temperatureHistory": [s.temperature for s in history if s.temperature is not None][-20:] if history else [],
        "soilHistory": [s.soil_moisture for s in history if s.soil_moisture is not None][-20:] if history else [],
        "tankHistory": [s.tank_level_percent for s in history if s.tank_level_percent is not None][-20:] if history else [],
        "history": [
            {"timestamp": s.timestamp.strftime("%H:%M"), "value": s.soil_moisture}
            for s in history if s.soil_moisture is not None
        ][-24:],
        "relays": [
            {
                "id": str(r.id),
                "name": r.name,
                "gpio": r.gpio,
                "state": r.state,
                "mode": getattr(r, "mode", "manual")
            }
            for r in relays
        ],
        "forecast": forecast or {}
    }
