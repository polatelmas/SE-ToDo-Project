from pydantic import BaseModel

class AIRequest(BaseModel):
    prompt: str
    user_id: int # Normalde token'dan alırız ama şimdilik manuel gönderelim