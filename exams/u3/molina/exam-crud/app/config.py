from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PORT: int = 3000
    DATABASE_URL: str
    DIRECT_URL: str

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
