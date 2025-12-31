import enum

class priority_level(enum.Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"

class task_status(enum.Enum):
    PENDING = "PENDING"
    COMPLETED = "COMPLETED"

class recurrence_type(enum.Enum):
    NONE = "NONE"
    DAILY = "DAILY"
    WEEKLY = "WEEKLY"
    WEEKDAYS = "WEEKDAYS"
    WEEKENDS = "WEEKENDS"