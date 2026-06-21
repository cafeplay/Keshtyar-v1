from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.rule import AutomationRule
from app.models.relay import Relay
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class RuleCreate(BaseModel):
    name: str
    relay_id: int
    rule_type: str
    threshold: float
    action_state: bool
    condition_type: str = "single"
    second_sensor_type: Optional[str] = None
    second_operator: Optional[str] = None
    second_threshold: Optional[float] = None

@router.get("/")
async def get_rules(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(AutomationRule).where(AutomationRule.user_id == user.id)
    )
    rules = result.scalars().all()
    
    return [
        {
            "id": r.id,
            "name": r.name,
            "relay_id": r.relay_id,
            "active": r.active,
            "rule_type": r.rule_type,
            "threshold": r.threshold,
            "action_state": r.action_state,
            "condition_type": r.condition_type,
            "second_sensor_type": r.second_sensor_type,
            "second_operator": r.second_operator,
            "second_threshold": r.second_threshold,
            "last_triggered": r.last_triggered.isoformat() if r.last_triggered else None,
            "created_at": r.created_at.isoformat() if r.created_at else None
        }
        for r in rules
    ]

@router.post("/")
async def create_rule(
    data: RuleCreate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Relay).where(
            Relay.id == data.relay_id,
            Relay.user_id == user.id
        )
    )
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="رله یافت نشد")
    
    rule = AutomationRule(
        user_id=user.id,
        relay_id=data.relay_id,
        name=data.name,
        rule_type=data.rule_type,
        threshold=data.threshold,
        action_state=data.action_state,
        condition_type=data.condition_type,
        second_sensor_type=data.second_sensor_type,
        second_operator=data.second_operator,
        second_threshold=data.second_threshold,
        active=True
    )
    db.add(rule)
    await db.commit()
    await db.refresh(rule)
    
    return {"id": rule.id, "message": "قانون با موفقیت ایجاد شد"}

@router.post("/{rule_id}/toggle")
async def toggle_rule(
    rule_id: int,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(AutomationRule).where(
            AutomationRule.id == rule_id,
            AutomationRule.user_id == user.id
        )
    )
    rule = result.scalar_one_or_none()
    if not rule:
        raise HTTPException(status_code=404, detail="قانون یافت نشد")
    
    rule.active = not rule.active
    await db.commit()
    
    return {"id": rule.id, "active": rule.active}

@router.delete("/{rule_id}")
async def delete_rule(
    rule_id: int,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(AutomationRule).where(
            AutomationRule.id == rule_id,
            AutomationRule.user_id == user.id
        )
    )
    rule = result.scalar_one_or_none()
    if not rule:
        raise HTTPException(status_code=404, detail="قانون یافت نشد")
    
    await db.delete(rule)
    await db.commit()
    
    return {"message": "قانون حذف شد"}
