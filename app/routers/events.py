from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models.event import Event
from app.schemas.event import EventCreate, EventResponse, EventUpdate

router = APIRouter()

@router.post("/", response_model=EventResponse)
def create_event(event: EventCreate, user_id: int, db: Session = Depends(get_db)):
    db_event = Event(**event.model_dump(), user_id=user_id)
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event


@router.get("/", response_model=List[EventResponse])
def get_events(user_id: int, db: Session = Depends(get_db)):
    events = db.query(Event).filter(Event.user_id == user_id).all()
    return events


@router.get("/{event_id}", response_model=EventResponse)
def get_event(event_id: int, user_id: int, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id, Event.user_id == user_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found.")
    return event


@router.put("/{event_id}", response_model=EventResponse)
def update_event(event_id: int, event_update: EventUpdate, user_id: int, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id, Event.user_id == user_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found.")
    
    update_data = event_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(event, field, value)

    db.commit()
    db.refresh(event)
    return event


@router.delete("/{event_id}")
def delete_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found.")
    
    db.delete(event)
    db.commit()
    return {"message": "Event deleted."}