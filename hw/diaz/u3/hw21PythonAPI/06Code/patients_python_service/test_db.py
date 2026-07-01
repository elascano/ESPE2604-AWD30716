import os
from dotenv import load_dotenv
import psycopg2

load_dotenv()

# Load env file from parent directory
root_env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "env"))
if os.path.exists(root_env_path):
    load_dotenv(dotenv_path=root_env_path)

db_url = os.getenv("DIRECT_URL") or os.getenv("DATABASE_URL")
if db_url and "?" in db_url:
    db_url = db_url.split("?")[0]

print(f"Testing connection to: {db_url}")

try:
    conn = psycopg2.connect(db_url, connect_timeout=5)
    print("Connection SUCCESSFUL!")
    cursor = conn.cursor()
    cursor.execute("SELECT version();")
    print(f"PostgreSQL Version: {cursor.fetchone()}")
    cursor.close()
    conn.close()
except Exception as e:
    print(f"Connection FAILED: {e}")
