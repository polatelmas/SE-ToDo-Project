from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models.note import Note
from app.schemas.note import NoteCreate, NoteResponse, NoteUpdate

router = APIRouter()

@router.post("/", response_model=NoteResponse)
def create_note(note: NoteCreate, user_id: int, db: Session = Depends(get_db)):
    db_note = Note(**note.model_dump(), user_id=user_id)
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note


@router.get("/", response_model=List[NoteResponse])
def get_notes(user_id: int, db: Session = Depends(get_db)):
    notes = db.query(Note).filter(Note.user_id == user_id).all()
    return notes


@router.get("/{note_id}", response_model=NoteResponse)
def get_note(note_id: int, user_id: int, db: Session = Depends(get_db)):
    note = db.query(Note).filter(Note.id == note_id, Note.user_id == user_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found.")
    return note


@router.put("/{note_id}", response_model=NoteResponse)
def update_note(note_id: int, note_update: NoteUpdate, user_id: int, db: Session = Depends(get_db)):
    note = db.query(Note).filter(Note.id == note_id, Note.user_id == user_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found.")
    
    update_data = note_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(note, field, value)

    db.commit()
    db.refresh(note)
    return note


@router.delete("/{note_id}")
def delete_note(note_id: int, db: Session = Depends(get_db)):
    note = db.query(Note).filter(Note.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found.")
    
    db.delete(note)
    db.commit()
    return {"message": "Note deleted."}