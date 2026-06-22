from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user, get_password_hash
from app.models.user import User
from pydantic import BaseModel
from typing import Optional
import hashlib

router = APIRouter()

class SettingsUpdate(BaseModel):
    farm_name: Optional[str] = None
    phone_number: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    tank_height_mm: Optional[float] = None
    tank_capacity_liters: Optional[float] = None
    soil_dry_raw: Optional[int] = None
    soil_wet_raw: Optional[int] = None
    alert_cooldown_soil: Optional[int] = None
    alert_cooldown_temp: Optional[int] = None
    alert_cooldown_tank: Optional[int] = None
    ai_autonomous_mode: Optional[bool] = None

class PasswordUpdate(BaseModel):
    old_password: str
    new_password: str

@router.get("/")
def get_settings(
    user: User = Depends(get_current_user)
):
    return {
        "farm_name": user.farm_name,
        "phone_number": user.phone_number,
        "latitude": user.latitude,
        "longitude": user.longitude,
        "tank_height_mm": user.tank_height_mm,
        "tank_capacity_liters": user.tank_capacity_liters,
        "soil_dry_raw": user.soil_dry_raw,
        "soil_wet_raw": user.soil_wet_raw,
        "alert_cooldown_soil": user.alert_cooldown_soil,
        "alert_cooldown_temp": user.alert_cooldown_temp,
        "alert_cooldown_tank": user.alert_cooldown_tank,
        "ai_autonomous_mode": user.ai_autonomous_mode,
        "device_code": user.device_code,
        "created_at": user.created_at.isoformat() if user.created_at else None
    }

@router.put("/")
def update_settings(
    data: SettingsUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    for key, value in data.dict(exclude_unset=True).items():
        if value is not None:
            setattr(user, key, value)
    
    db.commit()
    db.refresh(user)
    
    return {"message": "تنظیمات ذخیره شد"}

@router.put("/password")
def update_password(
    data: PasswordUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if user.password_hash != hashlib.sha256(data.old_password.encode()).hexdigest():
        raise HTTPException(status_code=400, detail="رمز عبور فعلی اشتباه است")
    
    if len(data.new_password) < 4:
        raise HTTPException(status_code=400, detail="رمز عبور جدید باید حداقل ۴ کاراکتر باشد")
    
    user.password_hash = hashlib.sha256(data.new_password.encode()).hexdigest()
    db.commit()
    
    return {"message": "رمز عبور تغییر کرد"}
