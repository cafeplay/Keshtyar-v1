import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    # دیتابیس
    DATABASE_URL: str = os.getenv("DATABASE_URL", "")
    
    # امنیت
    SECRET_KEY: str = os.getenv("SECRET_KEY", "dev-secret-key")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 روز
    
    # Together AI
    TOGETHER_API_KEY: str = os.getenv("TOGETHER_API_KEY", "")
    DEFAULT_AI_MODEL: str = os.getenv("DEFAULT_AI_MODEL", "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo")
    
    # تنظیمات ESP32
    ESP32_HTTP_TIMEOUT: int = 30
    MAX_SMS_PER_RESPONSE: int = 5
    
    # مختصات پیش‌فرض
    DEFAULT_LATITUDE: float = 35.6892
    DEFAULT_LONGITUDE: float = 51.3890
    
    # تنظیمات تانک
    DEFAULT_TANK_HEIGHT_MM: float = 1000.0
    DEFAULT_TANK_CAPACITY_L: float = 10000.0

settings = Settings()
