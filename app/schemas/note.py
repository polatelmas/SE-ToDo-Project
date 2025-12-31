from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

class NoteBase(BaseModel):
    title: str
    content: str
    category_id: Optional[int] = None
    event_id: Optional[int] = None

class NoteCreate(NoteBase):
    pass

class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    category_id: Optional[int] = None
    event_id: Optional[int] = None
    model_config = ConfigDict(extra="ignore")

class NoteResponse(NoteBase):
    id: int
    user_id: int
    color_code: Optional[str] = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)