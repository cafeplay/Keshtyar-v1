from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class SensorDataBase(BaseModel):
    temperature: Optional[float] = None
    humidity: Optional[float] = None
    soil_moisture_raw: Optional[int] = None
    tank_distance_mm: Optional[float] = None

class SensorDataCreate(SensorDataBase):
    device_code: str

class SensorDataResponse(SensorDataBase):
    id: int
    user_id: int
    timestamp: datetime
    soil_moisture: Optional[float] = None
    tank_level_percent: Optional[float] = None
    tank_liters: Optional[float] = None
    
    class Config:
        from_attributes = True
