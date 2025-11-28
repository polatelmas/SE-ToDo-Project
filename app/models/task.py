from sqlalchemy import Column, Integer, String, Text, DateTime, Date, ForeignKey, Enum, Boolean, func
from sqlalchemy.orm import relationship
from app.db.database import Base
from app.models.lookups import TaskStatus, PriorityLevel, RecurrenceType

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    priority_id = Column(Integer, ForeignKey("priority_levels.id"), default = 2, nullable=False)
    status_id = Column(Integer, ForeignKey("task_statuses.id"), default = 1, nullable=False)
    recurrence_type_id = Column(Integer, ForeignKey("recurrence_types.id"), default = 1, nullable=False ) 
    due_date = Column(DateTime) 
    recurrence_end_date = Column(Date)
    color_code = Column(String(7))
    created_at = Column(DateTime, server_default=func.now())

    owner = relationship("User", back_populates="tasks")
    category = relationship("Category", back_populates="tasks")
    subtasks = relationship("Subtask", back_populates="task", cascade="all, delete-orphan")

    priority = relationship("PriorityLevel")
    status = relationship("TaskStatus")
    recurrence_type = relationship("RecurrenceType")

class Subtask(Base):
    __tablename__ = "subtasks"
    id = Column(Integer, primary_key=True)
    task_id = Column(Integer, ForeignKey("tasks.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    is_completed = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())

    task = relationship("Task", back_populates="subtasks")

