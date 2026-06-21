from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base

class AutomationRule(Base):
    __tablename__ = "automation_rules"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    relay_id = Column(Integer, ForeignKey("relays.id"), nullable=False)
    
    name = Column(String(100), nullable=False)
    active = Column(Boolean, default=True)
    
    rule_type = Column(String(50), nullable=False)
    threshold = Column(Float, nullable=True)
    
    action_state = Column(Boolean, nullable=False)
    
    condition_type = Column(String(20), default="single")
    second_sensor_type = Column(String(30), nullable=True)
    second_operator = Column(String(10), nullable=True)
    second_threshold = Column(Float, nullable=True)
    
    last_triggered = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
