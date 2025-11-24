from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, func
from app.db.base import Base

class Note(Base):
    __tablename__ = "notes"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"))
    event_id = Column(Integer, ForeignKey("events.id"))
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    color_code = Column(String(7))
    created_at = Column(DateTime, server_default=func.now())