import os
from sqlmodel import create_engine, SQLModel, Session
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), '.env'))

DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL:
    if DATABASE_URL.startswith("postgres"):
        DATABASE_URL = "postgresql+pg8000://" + DATABASE_URL.split("://", 1)[1]
    if "?pgbouncer=true" in DATABASE_URL:
        DATABASE_URL = DATABASE_URL.replace("?pgbouncer=true", "")

engine = create_engine(DATABASE_URL, echo=True)

def init_db():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
