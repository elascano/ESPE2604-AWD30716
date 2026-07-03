from motor.motor_asyncio import AsyncIOMotorClient
from pydantic_settings import BaseSettings

# Workaround for Beanie and Motor compatibility:
# Beanie attempts to call client.append_metadata(). Since Motor client resolves
# dynamic attributes to database objects, client.append_metadata returns a database,
# causing a TypeError when called. Setting a dummy function on the class resolves this.
AsyncIOMotorClient.append_metadata = lambda *args, **kwargs: None

class Settings(BaseSettings):
    mongo_uri: str = "mongodb+srv://oop:oop@cluster0.9knxc.mongodb.net/oop?appName=Cluster0"
    mongo_db_name: str = "oop"

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()

client = AsyncIOMotorClient(settings.mongo_uri)
db = client[settings.mongo_db_name]


async def get_db():
    yield db
