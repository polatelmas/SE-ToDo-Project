import os
import json
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.task import Task
from app.schemas.ai import AIRequest
from google import genai
from app.core.config import settings

# API KEY'i buraya koy veya .env dosyasından çek
client = genai.Client(api_key=settings.GOOGLE_API_KEY)
model = client.models.generate_content(model="gemini-2.5-flash", contents="Explain how AI works in a few words")

router = APIRouter()

# ToDo: 