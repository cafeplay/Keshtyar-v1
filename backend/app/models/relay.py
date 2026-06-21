from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base

class Relay(Base):
    __tablename__ = "relays"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    name = Column(String(50), nullable=False)
    gpio = Column(Integer, nullable=False)
    state = Column(Boolean, default=False)
    mode = Column(String(20), default="manual")
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
