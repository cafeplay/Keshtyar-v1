import sys
import os

# اضافه کردن مسیر backend به sys.path
sys.path.insert(0, os.path.dirname(__file__))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import auth_router, dashboard_router, relays_router, rules_router, alerts_router, history_router, settings_router, ai_router
from app.api.legacy import sensor_router, ack_router

app = FastAPI(title="Smart Agriculture API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(dashboard_router, prefix="/api/v1/dashboard", tags=["dashboard"])
app.include_router(relays_router, prefix="/api/v1/relays", tags=["relays"])
app.include_router(rules_router, prefix="/api/v1/rules", tags=["rules"])
app.include_router(alerts_router, prefix="/api/v1/alerts", tags=["alerts"])
app.include_router(history_router, prefix="/api/v1/history", tags=["history"])
app.include_router(settings_router, prefix="/api/v1/settings", tags=["settings"])
app.include_router(ai_router, prefix="/api/v1/ai", tags=["ai"])

app.include_router(sensor_router, tags=["legacy"])
app.include_router(ack_router, tags=["legacy"])

@app.get("/")
async def root():
    return {"message": "Smart Agriculture API", "version": "2.0.0"}

app = app
