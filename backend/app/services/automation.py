from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.relay import Relay
from app.models.rule import AutomationRule
from app.models.command import CommandLog
import json
import uuid
from datetime import datetime

async def evaluate_automation_rules(
    db: AsyncSession,
    user_id: int,
    current_soil: float,
    current_temp: float,
    current_tank: float
) -> list:
    """ارزیابی قوانین اتوماسیون"""
    
    result = await db.execute(
        select(AutomationRule).where(
            AutomationRule.user_id == user_id,
            AutomationRule.active == True
        )
    )
    rules = result.scalars().all()
    
    commands = []
    now = datetime.utcnow()
    
    for rule in rules:
        should_execute = False
        
        # قانون ترکیبی (AND)
        if rule.condition_type == "and" and rule.second_sensor_type:
            # شرط اول (رطوبت خاک)
            first_ok = False
            if rule.rule_type == "moisture_below":
                first_ok = current_soil < rule.threshold
            elif rule.rule_type == "moisture_above":
                first_ok = current_soil > rule.threshold
            
            if first_ok:
                second_value = current_temp if rule.second_sensor_type == "temperature" else current_tank
                if second_value is not None:
                    if rule.second_operator == "below":
                        should_execute = second_value < rule.second_threshold
                    elif rule.second_operator == "above":
                        should_execute = second_value > rule.second_threshold
        
        # قانون ساده
        elif "below" in rule.rule_type or "above" in rule.rule_type:
            sensor_type = rule.rule_type.split("_")[0] if "_" in rule.rule_type else "soil_moisture"
            
            value = None
            if sensor_type == "soil_moisture":
                value = current_soil
            elif sensor_type == "temperature":
                value = current_temp
            elif sensor_type == "tank_level":
                value = current_tank
            
            if value is not None:
                if "below" in rule.rule_type:
                    should_execute = value < rule.threshold
                elif "above" in rule.rule_type:
                    should_execute = value > rule.threshold
        
        # جلوگیری از اجرای مکرر
        if should_execute and rule.last_triggered:
            time_since = (now - rule.last_triggered).total_seconds() / 60
            if time_since < 5:
                continue
        
        if should_execute:
            rule.last_triggered = now
            await db.commit()
            
            # دریافت رله
            relay_result = await db.execute(select(Relay).where(Relay.id == rule.relay_id))
            relay = relay_result.scalar_one_or_none()
            
            if relay and relay.state != rule.action_state:
                relay.state = rule.action_state
                await db.commit()
                
                command_id = str(uuid.uuid4())
                command = CommandLog(
                    user_id=user_id,
                    command_id=command_id,
                    command_type="relay_set",
                    payload=json.dumps({"gpio": relay.gpio, "state": rule.action_state}),
                    acknowledged=False
                )
                db.add(command)
                await db.commit()
                
                commands.append({
                    "id": command_id,
                    "type": "relay_set",
                    "payload": {"gpio": relay.gpio, "state": rule.action_state}
                })
    
    return commands
