import httpx
from typing import Dict, Optional

OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"

async def get_weather_forecast(latitude: float, longitude: float) -> Optional[Dict]:
    """دریافت پیش‌بینی آب‌وهوا از Open-Meteo"""
    
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "hourly": "temperature_2m,relative_humidity_2m,rain",
        "daily": "temperature_2m_max,temperature_2m_min,rain_sum,windspeed_10m_max,uv_index_max",
        "timezone": "auto",
        "forecast_days": 3
    }
    
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.get(OPEN_METEO_URL, params=params)
            response.raise_for_status()
            data = response.json()
            
            daily = data.get("daily", {})
            return {
                "today": {
                    "temp_max": daily.get("temperature_2m_max", [0])[0] if daily.get("temperature_2m_max") else 0,
                    "temp_min": daily.get("temperature_2m_min", [0])[0] if daily.get("temperature_2m_min") else 0,
                    "rain": daily.get("rain_sum", [0])[0] if daily.get("rain_sum") else 0
                },
                "tomorrow": {
                    "temp_max": daily.get("temperature_2m_max", [0])[1] if len(daily.get("temperature_2m_max", [])) > 1 else 0,
                    "temp_min": daily.get("temperature_2m_min", [0])[1] if len(daily.get("temperature_2m_min", [])) > 1 else 0,
                    "rain": daily.get("rain_sum", [0])[1] if len(daily.get("rain_sum", [])) > 1 else 0
                }
            }
    except Exception as e:
        print(f"خطا در دریافت آب‌وهوا: {e}")
        return None
