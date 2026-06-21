from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import AsyncSessionLocal
from app.models.user import User
from app.models.sensor import SensorData
from app.models.relay import Relay
from app.models.command import CommandLog
from app.services.automation import evaluate_automation_rules
from app.services.alerts import check_alert_rules
from app.services.weather import get_weather_forecast
import json

router = APIRouter()

class SensorPayload(BaseModel):
    device_code: str
    temperature: Optional[float] = None
    humidity: Optional[float] = None
    soil_moisture_raw: Optional[int] = None
    tank_distance_mm: Optional[float] = None

@router.post("/api/sensor")
async def sensor_endpoint(payload: SensorPayload):
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(User).where(User.device_code == payload.device_code))
        user = result.scalar_one_or_none()
        if not user:
            raise HTTPException(status_code=401, detail="کد یکتا نامعتبر")
        
        soil_percent = None
        if payload.soil_moisture_raw is not None:
            dry = user.soil_dry_raw or 3500
            wet = user.soil_wet_raw or 1500
            if dry > wet:
                if payload.soil_moisture_raw >= dry:
                    soil_percent = 0.0
                elif payload.soil_moisture_raw <= wet:
                    soil_percent = 100.0
                else:
                    soil_percent = ((dry - payload.soil_moisture_raw) / (dry - wet)) * 100
        
        sensor = SensorData(
            user_id=user.id,
            temperature=payload.temperature,
            humidity=payload.humidity,
            soil_moisture_raw=payload.soil_moisture_raw,
            soil_moisture=round(soil_percent, 1) if soil_percent is not None else None,
            tank_distance_mm=payload.tank_distance_mm
        )
        
        height = user.tank_height_mm or 1000
        capacity = user.tank_capacity_liters or 10000
        if sensor.tank_distance_mm is not None and sensor.tank_distance_mm > 0:
            if sensor.tank_distance_mm >= height:
                sensor.tank_level_percent = 0
                sensor.tank_liters = 0
            else:
                water_height = height - sensor.tank_distance_mm
                sensor.tank_level_percent = min((water_height / height) * 100, 100)
                sensor.tank_liters = (sensor.tank_level_percent / 100) * capacity
        
        db.add(sensor)
        await db.commit()
        await db.refresh(sensor)
        
        relay_result = await db.execute(select(Relay).where(Relay.user_id == user.id))
        relays = relay_result.scalars().all()
        relay_states = {str(r.gpio): r.state for r in relays}
        
        commands = await evaluate_automation_rules(
            db,
            user.id,
            current_soil=sensor.soil_moisture or 0,
            current_temp=sensor.temperature or 0,
            current_tank=sensor.tank_level_percent or 0
        )
        
        cmd_result = await db.execute(
            select(CommandLog).where(
                CommandLog.user_id == user.id,
                CommandLog.acknowledged == False
            )
        )
        pending = cmd_result.scalars().all()
        
        for cmd in pending:
            commands.append({
                "id": cmd.command_id,
                "type": cmd.command_type,
                "payload": json.loads(cmd.payload) if cmd.payload else {}
            })
        
        forecast = await get_weather_forecast(user.latitude, user.longitude)
        sensor_dict = {
            'soil_moisture': sensor.soil_moisture,
            'temperature': sensor.temperature,
            'tank_level': sensor.tank_level_percent
        }
        sms_requests = await check_alert_rules(db, user.id, sensor_dict, sensor.tank_liters, forecast)
        
        return {
            "status": "ok",
            "relay_states": relay_states,
            "commands": commands,
            "sms_requests": sms_requests
      }
