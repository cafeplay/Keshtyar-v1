import os
from typing import Dict, Any
from openai import OpenAI

# ========== تنظیمات DeepSeek ==========
DEEPSEEK_API_KEY = os.environ.get("DEEPSEEK_API_KEY")
client = OpenAI(
    api_key=DEEPSEEK_API_KEY,
    base_url="https://api.deepseek.com"
) if DEEPSEEK_API_KEY else None

DEFAULT_MODEL = "deepseek-chat"  # یا "deepseek-reasoner" برای تحلیل عمیق‌تر


def generate_ai_recommendation(
    soil_moisture: float,
    temperature: float,
    tank_level: float,
    forecast: Dict,
    history: list
) -> Dict[str, Any]:
    """تولید توصیه هوشمند با استفاده از DeepSeek API"""
    
    # اگر کلید API وجود نداشت، از حالت Fallback استفاده کن
    if not client:
        return {
            "success": False,
            "text": generate_fallback_recommendation(soil_moisture, temperature, tank_level),
            "action": "monitor",
            "confidence": 0,
            "reason": "AI در دسترس نیست",
            "suggested_time": "06:00"
        }
    
    try:
        # تحلیل روند داده‌ها
        soil_trend = analyze_trend(history, 'soil_moisture')
        temp_trend = analyze_trend(history, 'temperature')
        
        # ساخت پرامپت
        prompt = f"""
        داده‌های فعلی مزرعه:
        - رطوبت خاک: {soil_moisture:.0f}%
        - دما: {temperature:.1f}°C
        - سطح تانک: {tank_level:.0f}%
        - روند رطوبت در ۶ ساعت گذشته: {soil_trend}
        - روند دما در ۶ ساعت گذشته: {temp_trend}
        - بارش پیش‌بینی شده امروز: {forecast.get('today', {}).get('rain', 0)} mm
        - بارش پیش‌بینی شده فردا: {forecast.get('tomorrow', {}).get('rain', 0)} mm
        
        لطفاً یک توصیه‌ی دقیق و کاربردی برای مدیریت مزرعه ارائه دهید.
        
        خروجی را دقیقاً به این صورت بنویسید (هر بخش در یک خط جداگانه):
        اقدام: [آبیاری/تهویه/صبر/هشدار]
        دلیل: [توضیح مختصر حداکثر ۱۵ کلمه]
        زمان: [ساعت به فرمت HH:MM]
        """
        
        # ارسال درخواست به DeepSeek
        response = client.chat.completions.create(
            model=DEFAULT_MODEL,
            messages=[
                {
                    "role": "system",
                    "content": "شما یک دستیار هوشمند کشاورزی هستید. پاسخ‌ها را فقط به فارسی و مختصر بدهید."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.7,
            max_tokens=200
        )
        
        # پردازش پاسخ
        ai_response = response.choices[0].message.content
        parsed = parse_ai_response(ai_response)
        
        return {
            "success": True,
            "text": ai_response,
            "action": parsed.get("action", "monitor"),
            "confidence": 85,
            "reason": parsed.get("reason", "تحلیل داده‌ها"),
            "suggested_time": parsed.get("time", "06:00")
        }
        
    except Exception as e:
        # در صورت بروز خطا، از Fallback استفاده کن
        return {
            "success": False,
            "text": generate_fallback_recommendation(soil_moisture, temperature, tank_level),
            "action": "monitor",
            "confidence": 0,
            "reason": f"خطا: {str(e)[:50]}",
            "suggested_time": "06:00"
        }


def parse_ai_response(response: str) -> Dict:
    """استخراج اطلاعات ساختاریافته از پاسخ DeepSeek"""
    result = {"action": "monitor", "reason": "", "time": "06:00"}
    
    for line in response.split('\n'):
        if 'اقدام:' in line:
            parts = line.split(':', 1)
            if len(parts) > 1:
                result["action"] = parts[1].strip()
        elif 'دلیل:' in line:
            parts = line.split(':', 1)
            if len(parts) > 1:
                result["reason"] = parts[1].strip()
        elif 'زمان:' in line:
            parts = line.split(':', 1)
            if len(parts) > 1:
                result["time"] = parts[1].strip()
    
    # نرمال‌سازی اقدام
    action_map = {
        'آبیاری': 'irrigate',
        'تهویه': 'ventilate',
        'صبر': 'monitor',
        'هشدار': 'alert'
    }
    result["action"] = action_map.get(result["action"], 'monitor')
    return result


def analyze_trend(history: list, field: str, hours: int = 6) -> str:
    """تحلیل روند داده‌ها در بازه زمانی مشخص"""
    if not history or len(history) < 2:
        return 'ثابت'
    
    recent = [h.get(field, 0) for h in history[-hours:] if h.get(field) is not None]
    
    if len(recent) < 2:
        return 'ثابت'
    
    mid = len(recent) // 2
    if mid == 0:
        return 'ثابت'
    
    first_avg = sum(recent[:mid]) / mid
    last_avg = sum(recent[mid:]) / (len(recent) - mid) if len(recent) > mid else first_avg
    
    diff = last_avg - first_avg
    if diff > 2:
        return 'صعودی'
    elif diff < -2:
        return 'نزولی'
    return 'ثابت'


def generate_fallback_recommendation(soil: float, temp: float, tank: float) -> str:
    """تولید توصیه ساده در صورت عدم دسترسی به AI"""
    if soil < 30 and temp > 30:
        return "رطوبت خاک پایین و دما بالا است. آبیاری فوری توصیه می‌شود."
    elif soil < 30:
        return "رطوبت خاک کمتر از حد مطلوب است. آبیاری توصیه می‌شود."
    elif temp > 35:
        return "دمای محیط بالا رفته است. تهویه را فعال کنید."
    elif tank < 20:
        return "سطح تانک بسیار پایین است. لطفاً تانک را پر کنید."
    else:
        return "وضعیت مزرعه پایدار است. به پایش ادامه دهید."


def get_ai_decision(soil: float, temp: float, tank: float, forecast: Dict, history: list) -> Dict:
    """نسخه ساده برای استفاده در اتوماسیون (بدون درخواست API)"""
    soil_trend = analyze_trend(history, 'soil_moisture')
    
    # تصمیم‌گیری بر اساس قوانین ساده
    if soil < 25 and soil_trend == 'نزولی':
        if forecast.get('today', {}).get('rain', 0) > 5:
            return {"action": "delay", "reason": "بارش پیش‌بینی شده"}
        return {"action": "irrigate", "reason": "رطوبت خاک بحرانی"}
    elif soil < 35 and soil_trend == 'نزولی':
        return {"action": "irrigate", "reason": "رطوبت خاک در حال کاهش"}
    elif temp > 38:
        return {"action": "ventilate", "reason": "دمای بالا"}
    elif tank < 15:
        return {"action": "alert", "reason": "سطح تانک بحرانی"}
    
    return {"action": "monitor", "reason": "وضعیت پایدار"}
