from .auth import router as auth_router
from .dashboard import router as dashboard_router
from .relays import router as relays_router
from .rules import router as rules_router
from .alerts import router as alerts_router
from .history import router as history_router
from .settings import router as settings_router
from .ai import router as ai_router

__all__ = [
    "auth_router",
    "dashboard_router",
    "relays_router",
    "rules_router",
    "alerts_router",
    "history_router",
    "settings_router",
    "ai_router"
]
