from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.core.security import verify_password, create_access_token, get_password_hash
from app.models.user import User
from pydantic import BaseModel

router = APIRouter()

class UserRegister(BaseModel):
    device_code: str
    password: str
    farm_name: str = "مزرعه من"
    phone_number: str = ""
    latitude: float = 35.6892
    longitude: float = 51.3890

@router.post("/register")
async def register(user_data: UserRegister, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.device_code == user_data.device_code))
    existing = result.scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=400, detail="این کد یکتا قبلاً ثبت شده است")
    
    user = User(
        device_code=user_data.device_code,
        password_hash=get_password_hash(user_data.password),
        farm_name=user_data.farm_name,
        phone_number=user_data.phone_number,
        latitude=user_data.latitude,
        longitude=user_data.longitude
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    
    return {"message": "ثبت‌نام با موفقیت انجام شد", "user_id": user.id}

@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.device_code == form_data.username))
    user = result.scalar_one_or_none()
    
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="کد یکتا یا رمز عبور اشتباه است",
        )
    
    access_token = create_access_token(data={"sub": str(user.id)})
    return {"access_token": access_token, "token_type": "bearer"}
