from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.engine import make_url
from app.core.config import settings

DATABASE_URL = settings.DATABASE_URL

# دیباگ - لاگ گرفتن از اطلاعات اتصال
url = make_url(DATABASE_URL)
print(f"DB USER = {url.username}")
print(f"DB HOST = {url.host}")
print(f"DB PORT = {url.port}")

# تبدیل به asyncpg
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
