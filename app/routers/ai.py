import json
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from google import genai
from datetime import datetime
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.task import Task
from app.models.event import Event
from app.schemas.ai import AIRequest
from app.core.config import settings
from app.core.constants import get_prompt

client = genai.Client(api_key=settings.GOOGLE_API_KEY)

router = APIRouter()

class AIParseRequest(BaseModel):
    text: str

@router.post("/parse")
def parse_text(req: AIParseRequest):
    prompt = get_prompt(req)
    response = client.models.generate_content(model="gemini-2.5-flash", contents=prompt)

    try:
        parsed = json.loads(response.text)
    except Exception:
        return {
            "error": "Gemini invalid JSON döndürdü.",
            "raw_output": response.text
        }

    return parsed