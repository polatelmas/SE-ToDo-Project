from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

# Ortak özellikler
class UserBase(BaseModel):
    username: str
    email: EmailStr
    birth_date: Optional[datetime] = None

# Kayıt olurken istenecekler (Şifre var)
class UserCreate(UserBase):
    password: str

# Login olurken istenecekler
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Kullanıcıya döneceğimiz cevap (Şifre YOK, ID VAR)
class UserResponse(UserBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True # ORM modunu açar (Eski adı orm_mode)