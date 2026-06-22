from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import create_access_token, get_current_user
from app.models.user import User
from pydantic import BaseModel
import hashlib

router = APIRouter()

class UserRegister(BaseModel):
    device_code: str
    password: str
    farm_name: str = "مزرعه من"
    phone_number: str = ""
    latitude: float = 35.6892
    longitude: float = 51.3890

# ============================================
# ثبت‌نام کاربر جدید
# ============================================
@router.post("/register")
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    # بررسی وجود کد یکتا
    existing = db.query(User).filter(User.device_code == user_data.device_code).first()
    if existing:
        raise HTTPException(status_code=400, detail="این کد یکتا قبلاً ثبت شده است")
    
    # هش کردن رمز با SHA256
    password_hash = hashlib.sha256(user_data.password.encode()).hexdigest()
    
    user = User(
        device_code=user_data.device_code,
        password_hash=password_hash,
        farm_name=user_data.farm_name,
        phone_number=user_data.phone_number,
        latitude=user_data.latitude,
        longitude=user_data.longitude
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    return {"message": "ثبت‌نام با موفقیت انجام شد", "user_id": user.id}


# ============================================
# ورود کاربر
# ============================================
@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.device_code == form_data.username).first()
    
    if not user or user.password_hash != hashlib.sha256(form_data.password.encode()).hexdigest():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="کد یکتا یا رمز عبور اشتباه است",
        )
    
    access_token = create_access_token(data={"sub": str(user.id)})
    return {"access_token": access_token, "token_type": "bearer"}


# ============================================
# دریافت اطلاعات کاربر فعلی (برای فرانت‌اند)
# ============================================
@router.get("/me")
def get_me(user: User = Depends(get_current_user)):
    return {
        "id": user.id,
        "device_code": user.device_code,
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
        "created_at": user.created_at.isoformat() if user.created_at else None
    }
