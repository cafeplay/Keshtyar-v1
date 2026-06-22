from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.sensor import SensorData
from app.models.ai_feedback import AIFeedback
from app.services.ai_service import generate_ai_recommendation
from app.services.weather import get_weather_forecast
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/recommend")
def get_ai_recommendation(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    sensor_data = db.query(SensorData).filter(
        SensorData.user_id == user.id
    ).order_by(SensorData.timestamp.desc()).limit(24).all()
    
    if not sensor_data:
        return {
            "success": False,
            "text": "هنوز داده‌ی کافی برای تحلیل وجود ندارد.",
            "action": "monitor",
            "confidence": 0
        }
    
    last = sensor_data[0]
    forecast = get_weather_forecast(user.latitude, user.longitude)
    
    history = [
        {
            "soil_moisture": s.soil_moisture,
            "temperature": s.temperature,
            "timestamp": s.timestamp
        }
        for s in sensor_data[:12]
    ]
    
    recommendation = generate_ai_recommendation(
        soil_moisture=last.soil_moisture or 0,
        temperature=last.temperature or 0,
        tank_level=last.tank_level_percent or 0,
        forecast=forecast or {},
        history=history
    )
    
    feedback = AIFeedback(
        user_id=user.id,
        action=recommendation.get("action", "monitor"),
        reason=recommendation.get("reason", ""),
        confidence=recommendation.get("confidence", 0),
        suggested_time=recommendation.get("suggested_time", "06:00"),
        generated_text=recommendation.get("text", ""),
        applied_automatically=user.ai_autonomous_mode
    )
    db.add(feedback)
    db.commit()
    
    if user.ai_autonomous_mode and recommendation.get("action") in ["irrigate", "ventilate"]:
        pass
    
    return recommendation

@router.post("/feedback")
def submit_ai_feedback(
    feedback_id: int,
    applied: bool,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    feedback = db.query(AIFeedback).filter(AIFeedback.id == feedback_id, AIFeedback.user_id == user.id).first()
    if not feedback:
        raise HTTPException(status_code=404, detail="یافت نشد")
    
    feedback.user_applied = applied
    db.commit()
    
    return {"message": "بازخورد ثبت شد"}
