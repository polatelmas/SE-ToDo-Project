from pydantic import BaseModel

class AIRequest(BaseModel):
    prompt: str
    user_id: int 