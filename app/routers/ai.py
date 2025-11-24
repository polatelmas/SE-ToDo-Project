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

@router.post("/process")
def process_command(request: AIRequest, db: Session = Depends(get_db)):
    
    # 1. Gemini'ye Talimat
    prompt = f"""
    Sen bir asistanısın. Kullanıcı metnini analiz et.
    Eğer bir görev (Task) ise JSON formatında döndür.
    
    Örnek JSON Çıktısı:
    [
      {{ "title": "Süt al", "description": "Marketten", "priority": "MEDIUM" }}
    ]
    
    Kullanıcı Girdisi: {request.prompt}
    """
    
    # 2. AI Cevabı
    try:
        response = model.generate_content(prompt)
        # JSON temizleme (Markdown taglerini silme)
        clean_text = response.text.replace("```json", "").replace("```", "").strip()
        data_list = json.loads(clean_text)
        
        created_items = []
        
        # 3. Veritabanına Kaydet
        for item in data_list:
            new_task = Task(
                title=item.get("title"),
                description=item.get("description"),
                priority=item.get("priority", "MEDIUM"),
                user_id=request.user_id # Kullanıcıya bağla
            )
            db.add(new_task)
            created_items.append(new_task)
            
        db.commit()
        return {"status": "success", "created_count": len(created_items)}
        
    except Exception as e:
        return {"status": "error", "detail": str(e)}