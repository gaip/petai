from typing import Dict, List, Optional
from .models import PetCreate, PetDetail, HistoryRecord, Alert

# In-Memory Database Simulation
initial_pet_state = {
    "Max": {
        "id": "Max",
        "name": "Max", 
        "pet_id": "Max", # legacy support
        "breed": "Golden Retriever",
        "age": 7,
        "risk": "High",
        "health_score": 82, 
        "history": [
            {"day": "Mon", "activity": 120, "sleep": 8},
            {"day": "Tue", "activity": 110, "sleep": 7.5},
            {"day": "Wed", "activity": 115, "sleep": 8},
            {"day": "Thu", "activity": 130, "sleep": 9},
            {"day": "Fri", "activity": 90, "sleep": 6},
            {"day": "Sat", "activity": 100, "sleep": 7},
            {"day": "Sun", "activity": 125, "sleep": 8.5}
        ],
        "alerts": [
             {
                "title": "Joint Stiffness Detected",
                "message": "Vertex AI Vision detected a 15% asymmetry in rear-left gait mechanics versus 30-day baseline.",
                "severity": "medium",
                "audio": "https://actions.google.com/sounds/v1/alarms/beep_short.ogg"
            }
        ]
    },
    "Charlie": {
        "id": "Charlie",
        "name": "Charlie", 
        "pet_id": "Charlie",
        "breed": "Labrador",
        "age": 5,
        "risk": "Low",
        "health_score": 95,
        "history": [
            {"day": "Mon", "activity": 140, "sleep": 9},
            {"day": "Tue", "activity": 130, "sleep": 8.5},
            {"day": "Wed", "activity": 145, "sleep": 9},
            {"day": "Thu", "activity": 150, "sleep": 9.5},
            {"day": "Fri", "activity": 120, "sleep": 8},
            {"day": "Sat", "activity": 160, "sleep": 10},
            {"day": "Sun", "activity": 155, "sleep": 9}
        ],
        "alerts": []
    }
}

class PetService:
    def __init__(self):
        self.db: Dict[str, dict] = initial_pet_state

    def get_all_pets(self) -> List[dict]:
        return list(self.db.values())

    def get_pet_by_name(self, name: str) -> Optional[dict]:
        name_cap = name.capitalize()
        # Find by ID or Name
        if name_cap in self.db:
            return self.db[name_cap]
        return None

    def create_pet(self, pet_in: PetCreate) -> dict:
        pet_id = pet_in.name.capitalize()
        
        # Simulate AI Analysis & History Generation
        initial_risk = "Low"
        initial_score = 98
        
        # Default history
        history = [
            {"day": "Mon", "activity": 100, "sleep": 8},
            {"day": "Tue", "activity": 110, "sleep": 8},
            {"day": "Wed", "activity": 105, "sleep": 8},
            {"day": "Thu", "activity": 100, "sleep": 8},
            {"day": "Fri", "activity": 115, "sleep": 8},
            {"day": "Sat", "activity": 120, "sleep": 8},
            {"day": "Sun", "activity": 100, "sleep": 8}
        ]
        alerts = []

        # Simple logic to simulate "AI" findings
        if pet_in.age > 10:
            initial_risk = "Medium"
            initial_score = 85
            alerts.append({
                "title": "Age-Related Slowdown",
                "message": f"Activity levels for {pet_id} are 15% below breed average.",
                "severity": "low",
                "audio": ""
            })
        
        new_pet = {
            "id": pet_id,
            "name": pet_id, # Using name as ID for simplicity
            "pet_id": pet_id,
            "breed": pet_in.breed,
            "age": pet_in.age,
            "risk": initial_risk,
            "health_score": initial_score,
            "history": history, 
            "alerts": alerts
        }
        
        self.db[pet_id] = new_pet
        return new_pet
        
    def generate_unknown_pet(self, name: str) -> dict:
        """Returns a mock object for a pet that doesn't exist, for demo resilience."""
        return {
            "id": name,
            "name": name,
            "pet_id": name,
            "breed": "Unknown Breed",
            "age": 0,
            "health_score": 98,
            "risk": "Low",
            "history": [],
            "alerts": []
        }

pet_service = PetService()
