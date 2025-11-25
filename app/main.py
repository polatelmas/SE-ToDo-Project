from fastapi import FastAPI
from app.db.database import engine, Base
from app.routers import auth, tasks, ai, events, notes, categories
from app.models import user, task, category, event, note

# Veritabanı tablolarını oluştur (Yoksa oluşturur)
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Routerları ekle
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(tasks.router, prefix="/tasks", tags=["Tasks"])
app.include_router(events.router, prefix="/events", tags=["Events"])
app.include_router(notes.router, prefix="/notes", tags=["Notes"])
app.include_router(categories.router, prefix="/categories", tags=["Categories"])
# app.include_router(ai.router, prefix="/ai", tags=["AI"])

@app.get("/")
def root():
    return {"message": "Hello, World!"}