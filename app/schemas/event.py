from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

class EventBase(BaseModel):
    title: str
    start_time: datetime
    end_time: datetime
    location: Optional[str] = None
    color_code: Optional[str] = "#3498db"

class EventCreate(EventBase):
    pass

class EventUpdate(BaseModel):
    title: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    location: Optional[str] = None
    color_code: Optional[str] = None
    model_config = ConfigDict(extra="ignore")

class EventResponse(EventBase):
    id: int
    user_id: int
    model_config = ConfigDict(from_attributes=True)