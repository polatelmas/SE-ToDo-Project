from pydantic import BaseModel

# --- CATEGORY SCHEMAS ---
class CategoryCreate(BaseModel):
    name: str
    color_code: str = "#3498db"

class CategoryResponse(CategoryCreate):
    id: int
    user_id: int
    class Config:
        from_attributes = True