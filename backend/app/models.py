from pydantic import BaseModel
from typing import List, Optional, Union

class HistoryRecord(BaseModel):
    day: str
    activity: float
    sleep: float

class Alert(BaseModel):
    title: str
    message: str
    severity: str
    audio: Optional[str] = None

class PetBase(BaseModel):
    name: str
    breed: str
    age: int

class PetCreate(PetBase):
    pass

class PetResponse(BaseModel):
    id: str
    name: str
    breed: str
    age: int
    risk: str
    health_score: int
    lastVisit: str = "Today"
    
class PetDetail(PetResponse):
    history: List[HistoryRecord]
    alerts: List[Alert]

class VideoAnalysisResponse(BaseModel):
    status: str
    analysis: str
