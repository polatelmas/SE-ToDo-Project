from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# Ortak Alanlar
class EventBase(BaseModel):
    title: str
    start_time: datetime
    end_time: datetime
    location: Optional[str] = None
    color_code: Optional[str] = "#3498db"

# Veri Oluştururken (User ID backend'den gelecek)
class EventCreate(EventBase):
    pass

# Veri Okurken (ID ve User ID dahil)
class EventResponse(EventBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True