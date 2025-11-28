from sqlalchemy import Column, Integer, String, Boolean, TinyInteger
from app.db.database import Base

# --- Priority Levels ---
class PriorityLevel(Base):
    __tablename__ = "priority_levels"
    
    id = Column(Integer, primary_key=True)
    code = Column(String(20), unique=True, nullable=False) # 'HIGH', 'MEDIUM', 'LOW'
    label = Column(String(50), nullable=False)             # 'High Priority', 'Medium Priority', 'Low Priority'
    sort_order = Column(TinyInteger, nullable=False)

# --- Task Statuses ---
class TaskStatus(Base):
    __tablename__ = "task_statuses"
    
    id = Column(Integer, primary_key=True)
    code = Column(String(20), unique=True, nullable=False) # 'PENDING', 'COMPLETED'
    label = Column(String(50), nullable=False)
    is_final = Column(Boolean, default=False)

# --- Recurrence Types ---
class RecurrenceType(Base):
    __tablename__ = "recurrence_types"
    
    id = Column(Integer, primary_key=True)
    code = Column(String(20), unique=True, nullable=False) # 'DAILY', 'WEEKLY', ...
    label = Column(String(50), nullable=False)