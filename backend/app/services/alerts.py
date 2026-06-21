from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.alert import AlertRule
from app.models.user import User
from datetime import datetime

async def check_alert_rules(
    db: AsyncSession,
    user_id: int,
    sensor_dict: dict,
    tank_liters: float,
    forecast: dict
) -> list:
    result = await db.execute(
        select(AlertRule).where(
            AlertRule.user_id == user_id,
            AlertRule.enabled == True
        )
    )
    alert_rules = result.scalars().all()
    
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        return []
    
    sms_requests = []
    now = datetime.utcnow()
    
    for rule in alert_rules:
        if rule.sensor_type not in sensor_dict:
            continue
        current_value = sensor_dict[rule.sensor_type]
        if current_value is None:
            continue
        
        should_alert = False
        if rule.operator == "below":
            should_alert = current_value < rule.threshold
        elif rule.operator == "above":
            should_alert = current_value > rule.threshold
        
        if should_alert:
            cooldown_map = {
                'soil_moisture': user.alert_cooldown_soil or 60,
                'temperature': user.alert_cooldown_temp or 120,
                'tank_level': user.alert_cooldown_tank or 60
            }
            cooldown = cooldown_map.get(rule.sensor_type, 60)
            
            if rule.last_sent_at:
                time_since = (now - rule.last_sent_at).total_seconds() / 60
                if time_since < cooldown:
                    continue
            
            rule.last_sent_at = now
            await db.commit()
            
            message = rule.sms_template.replace("{value}", str(round(current_value, 1)))
            if rule.sensor_type == "tank_level" and tank_liters:
                message = message.replace("{remaining_liters}", str(int(tank_liters)))
            
            if user.phone_number:
                sms_requests.append({
                    "phone_number": user.phone_number,
                    "text": message
                })
    
    return sms_requests
