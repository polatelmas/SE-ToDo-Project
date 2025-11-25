from pydantic import BaseModel, ConfigDict, Field
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
    model_config = ConfigDict(from_attributes=True)

# --- TASK SCHEMAS ---
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    is_completed: bool = False
    priority: str = "MEDIUM"
    due_date: Optional[datetime] = None

class TaskCreate(TaskBase):
    category_id: Optional[int] = None
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    is_completed: Optional[bool] = None
    due_date: Optional[datetime] = None
    category_id: Optional[int] = None
    model_config = ConfigDict(extra="ignore")

class TaskResponse(TaskBase):
    id: int
    status: task_status
    category: Optional[CategoryResponse] = None 
    subtasks: List[SubTaskResponse] = Field(decimal_factory=list)  
    model_config = ConfigDict(from_attributes=True)