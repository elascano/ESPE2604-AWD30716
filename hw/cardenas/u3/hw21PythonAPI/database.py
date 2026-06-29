import os
from dotenv import load_dotenv
from sqlmodel import create_engine, Session

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

db_engine = create_engine(DATABASE_URL)

def get_db():
    db_session = Session(db_engine)
    return db_session