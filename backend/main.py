from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from app.api.v1 import dashboard, relays, rules, alerts, history, settings, ai, auth
from app.api.legacy import sensor, ack

app = FastAPI(title="Smart Agriculture API", version="2.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ایجاد جداول
@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# روت‌ها
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(dashboard.router, prefix="/api/v1/dashboard", tags=["dashboard"])
app.include_router(relays.router, prefix="/api/v1/relays", tags=["relays"])
app.include_router(rules.router, prefix="/api/v1/rules", tags=["rules"])
app.include_router(alerts.router, prefix="/api/v1/alerts", tags=["alerts"])
app.include_router(history.router, prefix="/api/v1/history", tags=["history"])
app.include_router(settings.router, prefix="/api/v1/settings", tags=["settings"])
app.include_router(ai.router, prefix="/api/v1/ai", tags=["ai"])

# APIهای قدیمی ESP32 (بدون تغییر)
app.include_router(sensor.router, tags=["legacy"])
app.include_router(ack.router, tags=["legacy"])

@app.get("/")
async def root():
    return {"message": "Smart Agriculture API", "version": "2.0.0"}
