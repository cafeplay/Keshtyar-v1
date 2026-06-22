from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import create_access_token
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

@router.post("/register")
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.device_code == user_data.device_code).first()
    if existing:
        raise HTTPException(status_code=400, detail="این کد یکتا قبلاً ثبت شده است")
    
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
