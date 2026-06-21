from pydantic import BaseModel
from typing import Optional

class AIRecommendation(BaseModel):
    text: str
    action: str
    confidence: int
    reason: str
    suggested_time: str
    success: bool = True

class AIFeedbackCreate(BaseModel):
    feedback_id: int
    applied: bool
