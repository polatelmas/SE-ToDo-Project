from sqlalchemy import Column, Integer, String, Text, DateTime, Date, ForeignKey, Enum, Boolean, func
from sqlalchemy.orm import relationship
from app.db.database import Base
from app.core.enums import *

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    priority = Column(Enum(priority_level), default=priority_level.MEDIUM, nullable=False)
    status = Column(Enum(task_status), default=task_status.PENDING, nullable=False)
    due_date = Column(DateTime)
    recurrence_type = Column(Enum(recurrence_type), default=recurrence_type.NONE)
    recurrence_end_date = Column(Date)
    color_code = Column(String(7))
    created_at = Column(DateTime, server_default=func.now())

    category = relationship("Category", back_populates="tasks")
    subtasks = relationship("Subtask", backref="task", cascade="all, delete-orphan")

class Subtask(Base):
    __tablename__ = "subTask"
    id = Column(Integer, primary_key=True)
    task_id = Column(Integer, ForeignKey("tasks.id"), nullable=False)
    title = Column(String(255), nullable=False)
    is_completed = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())