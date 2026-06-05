import os
from pathlib import Path

from pymongo import MongoClient, DESCENDING
from dotenv import load_dotenv

ROOT_DIR = Path(__file__).resolve().parent.parent
load_dotenv(ROOT_DIR / ".env")

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
MONGODB_DB = os.getenv("MONGODB_DB", "nexushr")

client = MongoClient(MONGODB_URI)
db = client[MONGODB_DB]

employees_collection = db["employees"]
audit_collection = db["audit_logs"]


def init_db():
    employees_collection.create_index("id", unique=True)
    audit_collection.create_index([("time", DESCENDING)])
