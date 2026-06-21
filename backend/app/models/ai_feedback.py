from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from app.core.database import Base

class AIFeedback(Base):
    __tablename__ = "ai_feedbacks"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    action = Column(String(50))
    reason = Column(Text)
    confidence = Column(Float)
    suggested_time = Column(String(10))
    generated_text = Column(Text)
    
    user_applied = Column(Boolean, default=False)
    applied_automatically = Column(Boolean, default=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
