from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models.task import Task, Subtask
from app.schemas.todo import TaskCreate, TaskResponse, TaskUpdate, SubTaskCreate, SubTaskResponse, SubTaskUpdate

router = APIRouter()

# --- TASK ROUTERS ---

@router.post("/", response_model=TaskResponse)
def create_task(task: TaskCreate, user_id: int, db: Session = Depends(get_db)):
    # user_id normalde otomatiktir ama şimdilik query parameter olarak alalım
    new_task = Task(**task.model_dump(), user_id=user_id)
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task


@router.get("/", response_model=List[TaskResponse])
def get_tasks(user_id: int, db: Session = Depends(get_db)):
    tasks = db.query(Task).filter(Task.user_id == user_id).all()
    return tasks


@router.get("/{task_id}", response_model=TaskResponse)
def get_task(task_id: int, user_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id, Task.user_id == user_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found.")
    return task


@router.put("/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, task_update: TaskUpdate, user_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id, Task.user_id == user_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found.")
    
    update_data = task_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(task, field, value)

    db.commit()
    db.refresh(task)
    return task


@router.delete("/{task_id}")
def delete_task(task_id: int, user_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id, Task.user_id == user_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found.")
    
    db.delete(task)
    db.commit()
    return {"detail": "Task deleted successfully."}

# --- SUBTASK ROUTES ---

@router.post("/{task_id}/subtasks/", response_model=SubTaskResponse)
def create_subtask(task_id: int, subtask: SubTaskCreate, user_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id, Task.user_id == user_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found.")
    
    new_subtask = Subtask(title=subtask.title, is_completed=subtask.is_completed, task_id=task_id) 
    db.add(new_subtask)
    db.commit()
    db.refresh(new_subtask)
    return new_subtask


@router.put("/subtasks/{subtask_id}", response_model=SubTaskResponse)
def update_subtask(subtask_id: int, subtask_update: SubTaskUpdate, user_id: int, db: Session = Depends(get_db)):
    subtask = db.query(Subtask).filter(Subtask.id == subtask_id, Task.user_id == user_id).first()
    if not subtask:
        raise HTTPException(status_code=404, detail="Subtask not found.")
    
    update_data = subtask_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(subtask, field, value)

    db.commit()
    db.refresh(subtask)
    return subtask


@router.delete("/subtasks/{subtask_id}")
def delete_subtask(subtask_id: int, user_id: int, db: Session = Depends(get_db)):
    subtask = db.query(Subtask).filter(Subtask.id == subtask_id, Task.user_id == user_id).first()
    if not subtask:
        raise HTTPException(status_code=404, detail="Subtask not found.")
    
    db.delete(subtask)
    db.commit()
    return {"detail": "Subtask deleted successfully."}

