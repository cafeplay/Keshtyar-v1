from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.engine import make_url
from app.core.config import settings
import sys

DATABASE_URL = settings.DATABASE_URL

# ========== دیباگ ==========
print("=== DATABASE CONNECTION DEBUG ===", file=sys.stderr)
print(f"DATABASE_URL RAW: {DATABASE_URL}", file=sys.stderr)

try:
    parsed = make_url(DATABASE_URL)
    print(f"DB USER: {parsed.username}", file=sys.stderr)
    print(f"DB HOST: {parsed.host}", file=sys.stderr)
    print(f"DB PORT: {parsed.port}", file=sys.stderr)
    print(f"DB DATABASE: {parsed.database}", file=sys.stderr)
except Exception as e:
    print(f"URL PARSE ERROR: {e}", file=sys.stderr)
print("================================", file=sys.stderr)
# =============================

if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

engine = create_async_engine(DATABASE_URL, echo=False)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
