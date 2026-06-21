from .automation import evaluate_automation_rules
from .alerts import check_alert_rules
from .weather import get_weather_forecast
from .ai_service import generate_ai_recommendation
from .analytics import calculate_water_consumption, analyze_trend

__all__ = [
    "evaluate_automation_rules",
    "check_alert_rules",
    "get_weather_forecast",
    "generate_ai_recommendation",
    "calculate_water_consumption",
    "analyze_trend"
]
