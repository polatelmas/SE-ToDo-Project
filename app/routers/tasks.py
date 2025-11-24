from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models.task import Task # Senin Task modelin
from app.schemas.todo import TaskCreate, TaskResponse

router = APIRouter()

@router.post("/", response_model=TaskResponse)
def create_task(task: TaskCreate, user_id: int, db: Session = Depends(get_db)):
    # user_id normalde otomatiktir ama şimdilik query parameter olarak alalım
    new_task = Task(
        title=task.title,
        description=task.description,
        priority=task.priority,
        due_date=task.due_date,
        user_id=user_id, # Kullanıcı ID'si şart
        category_id=task.category_id
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

@router.get("/", response_model=List[TaskResponse])
def get_tasks(user_id: int, db: Session = Depends(get_db)):
    tasks = db.query(Task).filter(Task.user_id == user_id).all()
    return tasks