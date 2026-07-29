from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PORT: int = 3001
    CRUD_API_URL: str = "http://127.0.0.1:3000"
    VAT_RATE: float = Field(default=0.15, ge=0, le=1)

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
