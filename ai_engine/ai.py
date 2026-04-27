import os
from dotenv import load_dotenv
from pathlib import Path

env_path = Path(__file__).resolve().parent / ".env"

print("Looking for .env at:", env_path)

load_dotenv(dotenv_path=env_path)

print("KEY:", os.getenv("GOOGLE_API_KEY"))