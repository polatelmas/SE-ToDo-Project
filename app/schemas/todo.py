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
    priority_id: int
    due_date: Optional[datetime] = None
    color_code: Optional[str] = "#3498db"

class TaskCreate(TaskBase):
    category_id: Optional[int] = None
    status_id: int = 1
    recurrence_type_id: int = 1
    recurrence_end_date : Optional[date] = None

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    category_id: Optional[int] = None
    priority_id: Optional[int] = None
    status_id: Optional[int] = None
    recurrence_type_id: Optional[int] = None
    recurrence_end_date : Optional[date] = None
    color_code: Optional[str] = None
    model_config = ConfigDict(extra="ignore")

class TaskResponse(TaskBase):
    id: int
    user_id: int
    status_id: int
    recurrence_type_id: int
    recurrence_end_date: Optional[date] = None
    category: Optional[CategoryResponse] = None
    created_at: datetime
    subtasks: List[SubTaskResponse] = Field(default_factory=list)  
    model_config = ConfigDict(from_attributes=True)

class LookupBase(BaseModel):
    id: int
    code: str
    label: str
    model_config = ConfigDict(from_attributes=True)