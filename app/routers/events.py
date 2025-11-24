from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models.event import Event
from app.schemas.event import EventCreate, EventResponse

router = APIRouter()

# Yeni Etkinlik Ekle
@router.post("/", response_model=EventResponse)
def create_event(event: EventCreate, user_id: int, db: Session = Depends(get_db)):
    db_event = Event(**event.model_dump(), user_id=user_id)
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

# Etkinlikleri Listele
@router.get("/", response_model=List[EventResponse])
def get_events(user_id: int, db: Session = Depends(get_db)):
    events = db.query(Event).filter(Event.user_id == user_id).all()
    return events

# Etkinlik Sil
@router.delete("/{event_id}")
def delete_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Etkinlik bulunamadı")
    
    db.delete(event)
    db.commit()
    return {"message": "Etkinlik silindi"}