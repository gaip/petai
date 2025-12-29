from fastapi import APIRouter, HTTPException, UploadFile, File
from typing import List
from ..models import PetCreate, PetResponse, PetDetail, VideoAnalysisResponse
from ..services import pet_service

router = APIRouter()

@router.get("/pets", response_model=List[PetResponse])
def list_pets():
    """
    Get a list of all registered pets.
    """
    pets = pet_service.get_all_pets()
    # Transform to PetResponse (ignoring history/alerts for summary view)
    return [
        PetResponse(
            id=p["id"],
            name=p["name"],
            breed=p.get("breed", "Unknown"),
            age=p.get("age", 0),
            risk=p.get("risk", "Low"),
            health_score=p.get("health_score", 10),
            lastVisit=p.get("lastVisit", "Today")
        ) for p in pets
    ]

@router.post("/pets")
async def create_pet(name: str, breed: str, age: int):
    """
    Register a new pet.
    Note: Keeping query params for now to maintain compatibility with existing frontend, 
    but logic uses Pydantic.
    """
    pet_in = PetCreate(name=name, breed=breed, age=age)
    new_pet = pet_service.create_pet(pet_in)
    return {"status": "success", "petId": new_pet["id"]}

@router.get("/health/{pet_id}")
def get_health(pet_id: str):
    """
    Get detailed health info for a specific pet.
    Returns loosely typed dict for now to match flexible frontend expectations.
    """
    pet = pet_service.get_pet_by_name(pet_id)
    if not pet:
        # For the demo, return a generative 'unknown' pet rather than 404
        return pet_service.generate_unknown_pet(pet_id)
    return pet

@router.post("/upload")
def upload_video(file: bytes = File(default=None)): 
    """
    Simulate processing a video file for gait analysis.
    """
    return {"status": "success", "analysis": "Vision Model: No gait anomalies detected in typical stride."}
