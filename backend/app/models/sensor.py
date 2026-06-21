from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base

class SensorData(Base):
    __tablename__ = "sensor_data"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    
    temperature = Column(Float, nullable=True)
    humidity = Column(Float, nullable=True)
    soil_moisture_raw = Column(Integer, nullable=True)
    tank_distance_mm = Column(Float, nullable=True)
    
    soil_moisture = Column(Float, nullable=True)
    tank_level_percent = Column(Float, nullable=True)
    tank_liters = Column(Float, nullable=True)
