from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.sensor import SensorData
from datetime import datetime, timedelta
from typing import List, Dict, Any

async def calculate_water_consumption(
    db: AsyncSession,
    user_id: int,
    days: int = 30
) -> Dict[str, Any]:
    since = datetime.utcnow() - timedelta(days=days)
    
    result = await db.execute(
        select(SensorData)
        .where(
            SensorData.user_id == user_id,
            SensorData.timestamp >= since,
            SensorData.tank_liters.isnot(None)
        )
        .order_by(SensorData.timestamp.asc())
    )
    data = result.scalars().all()
    
    if len(data) < 2:
        return {
            "daily_avg": 0,
            "weekly_avg": 0,
            "monthly_avg": 0,
            "remaining_days": 0,
            "current_water": 0
        }
    
    total_consumption = 0
    days_with_data = 0
    
    for i in range(1, len(data)):
        time_diff = (data[i].timestamp - data[i-1].timestamp).total_seconds() / 3600 / 24
        if time_diff > 0 and data[i-1].tank_liters > data[i].tank_liters:
            consumption = data[i-1].tank_liters - data[i].tank_liters
            if 0 < consumption < 5000:
                total_consumption += consumption
                days_with_data += time_diff
    
    daily_avg = total_consumption / days_with_data if days_with_data > 0 else 0
    current_water = data[-1].tank_liters or 0
    
    return {
        "daily_avg": round(daily_avg),
        "weekly_avg": round(daily_avg * 7),
        "monthly_avg": round(daily_avg * 30),
        "remaining_days": int(current_water / daily_avg) if daily_avg > 0 else 0,
        "current_water": round(current_water)
    }

def analyze_trend(history: List[Dict], field: str, hours: int = 6) -> str:
    if not history or len(history) < 2:
        return 'ثابت'
    recent = [h.get(field, 0) for h in history[-hours:] if h.get(field) is not None]
    if len(recent) < 2:
        return 'ثابت'
    mid = len(recent) // 2
    if mid == 0:
        return 'ثابت'
    first_avg = sum(recent[:mid]) / mid
    last_avg = sum(recent[mid:]) / (len(recent) - mid) if len(recent) > mid else first_avg
    diff = last_avg - first_avg
    if diff > 2: return 'صعودی'
    elif diff < -2: return 'نزولی'
    return 'ثابت'
