from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.core.enums import task_status
from app.schemas.category import CategoryResponse

# --- SUBTASK SCHEMAS ---
class SubTaskCreate(BaseModel):
    title: str

class SubTaskResponse(SubTaskCreate):
    id: int
    is_completed: bool
    class Config:
        from_attributes = True

# --- TASK SCHEMAS ---
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    priority: str = "MEDIUM"
    due_date: Optional[datetime] = None

class TaskCreate(TaskBase):
    category_id: Optional[int] = None
    pass

class TaskResponse(TaskBase):
    id: int
    status: task_status
    category: Optional[CategoryResponse] = None # İlişki
    subtasks: List[SubTaskResponse] = []      # İlişki
    
    class Config:
        from_attributes = True