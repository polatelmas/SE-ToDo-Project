from pydantic import BaseModel, ConfigDict
from typing import Optional

class CategoryBase(BaseModel):
    name: str
    color_code: Optional[str] = "#3498db"

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    color_code: Optional[str] = None
    model_config = ConfigDict(extra="ignore")

class CategoryResponse(CategoryBase):
    id: int
    user_id: int
    model_config = ConfigDict(from_attributes=True)