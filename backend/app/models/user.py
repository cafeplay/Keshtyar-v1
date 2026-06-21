from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, BigInteger
from sqlalchemy.sql import func
from app.core.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    device_code = Column(String(50), unique=True, nullable=False)
    password_hash = Column(String(200), nullable=False)
    
    farm_name = Column(String(100), default="مزرعه من")
    latitude = Column(Float, default=35.6892)
    longitude = Column(Float, default=51.3890)
    phone_number = Column(String(20))
    
    tank_height_mm = Column(Float, default=1000.0)
    tank_capacity_liters = Column(Float, default=10000.0)
    
    soil_dry_raw = Column(Integer, default=3500)
    soil_wet_raw = Column(Integer, default=1500)
    
    alert_cooldown_soil = Column(Integer, default=60)
    alert_cooldown_temp = Column(Integer, default=120)
    alert_cooldown_tank = Column(Integer, default=60)
    alert_cooldown_rain = Column(Integer, default=720)
    alert_cooldown_water = Column(Integer, default=1440)
    
    ai_autonomous_mode = Column(Boolean, default=False)  # 🔥 جدید
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
