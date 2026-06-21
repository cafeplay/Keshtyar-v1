from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.sensor import SensorData
from app.models.relay import Relay
from app.services.weather import get_weather_forecast
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/")
async def get_dashboard_data(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # آخرین داده
    result = await db.execute(
        select(SensorData)
        .where(SensorData.user_id == user.id)
        .order_by(desc(SensorData.timestamp))
        .limit(1)
    )
    last = result.scalar_one_or_none()
    
    # تاریخچه ۲۴ ساعت
    since = datetime.utcnow() - timedelta(hours=24)
    result = await db.execute(
        select(SensorData)
        .where(
            SensorData.user_id == user.id,
            SensorData.timestamp >= since,
            SensorData.soil_moisture.isnot(None)
        )
        .order_by(SensorData.timestamp.asc())
    )
    history = result.scalars().all()
    
    # رله‌ها
    result = await db.execute(select(Relay).where(Relay.user_id == user.id))
    relays = result.scalars().all()
    
    # آب‌وهوا
    forecast = await get_weather_forecast(user.latitude, user.longitude)
    
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
