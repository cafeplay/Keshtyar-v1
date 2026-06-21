from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from app.core.database import Base

class CommandLog(Base):
    __tablename__ = "command_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    command_id = Column(String(36), unique=True, nullable=False)
    command_type = Column(String(50), nullable=True)  # relay_set, sensor_read, etc.
    payload = Column(Text, nullable=True)
    
    acknowledged = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    acknowledged_at = Column(DateTime(timezone=True), nullable=True)
