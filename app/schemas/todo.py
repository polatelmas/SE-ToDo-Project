from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, List
from datetime import datetime, date
from app.core.enums import task_status, priority_level, recurrence_type as rec_type
from app.schemas.category import CategoryResponse

# --- SUBTASK SCHEMAS ---
class SubTaskCreate(BaseModel):
    title: str

class SubTaskResponse(SubTaskCreate):
    id: int
    is_completed: bool
    model_config = ConfigDict(from_attributes=True)

# --- TASK SCHEMAS ---
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    priority: priority_level = priority_level.MEDIUM
    due_date: Optional[datetime] = None

class TaskCreate(TaskBase):
    category_id: Optional[int] = None
    status: Optional[task_status] = task_status.PENDING
    recurrence_type: Optional[rec_type] = rec_type.NONE
    recurrence_end_date : Optional[datetime] = None
    color_code: Optional[str] = "#3498db"
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    category_id: Optional[int] = None
    priority: Optional[priority_level] = priority_level.MEDIUM
    status: Optional[task_status] = task_status.PENDING
    recurrence_type: Optional[rec_type] = rec_type.NONE
    recurrence_end_date : Optional[date] = None
    color_code: Optional[str] = "#3498db"
    model_config = ConfigDict(extra="ignore")

class TaskResponse(TaskBase):
    id: int
    status: task_status
    category: Optional[CategoryResponse] = None 
    color_code: str
    subtasks: List[SubTaskResponse] = Field(default_factory=list)  
    model_config = ConfigDict(from_attributes=True)