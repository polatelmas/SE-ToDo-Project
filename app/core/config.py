# Database URL etc.
import os
from dotenv import load_dotenv

# .env dosyasını yükle
load_dotenv()

class Settings:
    PROJECT_NAME: str = "Gemini Todo App"
    VERSION: str = "1.0.0"
        
    GOOGLE_API_KEY: str = os.getenv("GOOGLE_API_KEY")
    DATABASE_URL: str = os.getenv("DATABASE_URL")

settings = Settings()