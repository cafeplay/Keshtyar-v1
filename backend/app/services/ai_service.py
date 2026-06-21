import os
from typing import Dict, Any
from together import Together

TOGETHER_API_KEY = os.environ.get("TOGETHER_API_KEY")
client = Together(api_key=TOGETHER_API_KEY) if TOGETHER_API_KEY else None

DEFAULT_MODEL = os.environ.get("DEFAULT_AI_MODEL", "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo")

def generate_ai_recommendation(
    soil_moisture: float,
    temperature: float,
    tank_level: float,
    forecast: Dict,
    history: list
) -> Dict[str, Any]:
    """تولید توصیه با Together AI"""
    
    # اگر API Key وجود نداشت، از منطق ساده استفاده کن
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
        # تحلیل روند
        soil_trend = analyze_trend(history, 'soil_moisture')
        
        # ساخت پرامپت
        prompt = f"""
        داده‌های فعلی مزرعه:
        - رطوبت خاک: {soil_moisture:.0f}%
        - دما: {temperature:.1f}°C
        - سطح تانک: {tank_level:.0f}%
        - روند رطوبت در ۶ ساعت گذشته: {soil_trend}
        - بارش پیش‌بینی شده امروز: {forecast.get('today', {}).get('rain', 0)} mm
        - بارش پیش‌بینی شده فردا: {forecast.get('tomorrow', {}).get('rain', 0)} mm
        
        لطفاً یک توصیه‌ی دقیق برای مدیریت مزرعه ارائه دهید.
        
        خروجی را دقیقاً به این صورت بنویسید (هر بخش در یک خط):
        اقدام: [آبیاری/تهویه/صبر/هشدار]
        دلیل: [توضیح مختصر حداکثر ۱۵ کلمه]
        زمان: [ساعت به فرمت HH:MM]
        """
        
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
        return {
            "success": False,
            "text": generate_fallback_recommendation(soil_moisture, temperature, tank_level),
            "action": "monitor",
            "confidence": 0,
            "reason": f"خطا: {str(e)[:50]}",
            "suggested_time": "06:00"
        }

def parse_ai_response(response: str) -> Dict:
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
    
    # نرمال‌سازی
    action_map = {
        'آبیاری': 'irrigate',
        'تهویه': 'ventilate',
        'صبر': 'monitor',
        'هشدار': 'alert'
    }
    result["action"] = action_map.get(result["action"], 'monitor')
    return result

def analyze_trend(history, field, hours=6) -> str:
    if not history or len(history) < 2:
        return 'ثابت'
    recent = [h.get(field, 0) for h in history[-6:] if h.get(field) is not None]
    if len(recent) < 2:
        return 'ثابت'
    mid = len(recent) // 2
    if mid == 0:
        return 'ثابت'
    first_avg = sum(recent[:mid]) / mid
    last_avg = sum(recent[mid:]) / (len(recent) - mid) if len(recent) > mid else first_avg
    diff = last_avg - first_avg
    if diff > 2: return 'صعودی'
    elif diff < -2: return 'نزولی'
    return 'ثابت'

def generate_fallback_recommendation(soil, temp, tank) -> str:
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

def get_ai_decision(soil, temp, tank, forecast, history) -> Dict:
    """نسخه‌ی ساده برای استفاده در اتوماسیون (بدون API)"""
    soil_trend = analyze_trend(history, 'soil_moisture')
    
    # تصمیم‌گیری بر اساس قوانین
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
