from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryUpdate, CategoryResponse
from app.db.database import get_db

router = APIRouter()

@router.post("/", response_model=CategoryResponse)
def create_category(category: CategoryCreate, user_id: int, db: Session = Depends(get_db)):
    new_category = Category(**category.model_dump(), user_id=user_id)
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return new_category


@router.get("/", response_model=List[CategoryResponse])
def get_categories(user_id: int, db: Session = Depends(get_db)):
    categories = db.query(Category).filter(Category.user_id == user_id).all()
    return categories


@router.get("/{category_id}", response_model=CategoryResponse)
def get_category(category_id: int, user_id: int, db: Session = Depends(get_db)):
    category = db.query(Category).filter(Category.id == category_id, Category.user_id == user_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found.")
    return category


@router.put("/{category_id}", response_model=CategoryResponse)
def update_category(category_id: int, category_update: CategoryUpdate, user_id: int, db: Session = Depends(get_db)):
    category = db.query(Category).filter(Category.id == category_id, Category.user_id == user_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    update_data = category_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(category, field, value)

    db.commit()
    db.refresh(category)
    return category


@router.delete("/{category_id}")
def delete_category(category_id: int, user_id: int, db: Session = Depends(get_db)):
    category = db.query(Category).filter(Category.id == category_id, Category.user_id == user_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    db.delete(category)
    db.commit()
    return {"detail": "Category deleted"}