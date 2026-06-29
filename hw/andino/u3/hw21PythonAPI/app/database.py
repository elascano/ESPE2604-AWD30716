from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()

engine = create_async_engine(
    settings.database_url,
    echo=False,
    connect_args={"statement_cache_size": 0},
)

async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


async def get_db():
    async with async_session() as session:
        yield session
