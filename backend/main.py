from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# Removed MockKafka imports as we are simplifying to pure Python simulation to ensure reliability
# import threading 

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global State (In-Memory Database)
latest_pet_state = {
    "Max": {
        "pet_id": "Max",
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
                "audio": "https://storage.googleapis.com/petai-assets/audio/alert_joint.mp3"
            }
        ]
    },
    "Charlie": {
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

@app.get("/")
def read_root():
    return {"status": "PetTwin AI Backend is running", "stack": "Python, TensorFlow, FastAPI"}

@app.post("/api/pets")
async def create_pet(name: str, breed: str, age: int):
    pet_id = name.capitalize()
    
    # Simulate AI Analysis & History Generation
    initial_risk = "Low"
    initial_score = 98
    # Baseline history
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
    if age > 10:
        initial_risk = "Medium"
        initial_score = 85
        alerts.append({
            "title": "Age-Related Slowdown",
            "message": f"Activity levels for {pet_id} are 15% below breed average.",
            "severity": "low",
            "audio": ""
        })
    
    latest_pet_state[pet_id] = {
        "pet_id": pet_id,
        "breed": breed,
        "age": age,
        "risk": initial_risk,
        "health_score": initial_score,
        "history": history, 
        "alerts": alerts
    }
    print(f"Registered new pet {pet_id} with AI baseline.")
    return {"status": "success", "petId": pet_id}

@app.get("/api/pets")
def list_pets():
    # Return list format for the Vet Portal
    return [
        {
            "id": i, 
            "name": p["pet_id"], 
            "breed": p.get("breed", "Unknown"), 
            "age": p.get("age", 0), 
            "risk": p.get("risk", "Low"),
            "health_score": p.get("health_score", 10),
            "lastVisit": "Today"
        } 
        for i, (k, p) in enumerate(latest_pet_state.items())
    ]

@app.post("/api/upload")
def upload_video(file: bytes = None): 
    # Simulate Video Analysis
    return {"status": "success", "analysis": "Vision Model: No gait anomalies detected in typical stride."}

@app.get("/api/health/{pet_id}")
def get_health(pet_id: str):
    pet_id = pet_id.capitalize()
    
    # Return existing state or default (if not found, e.g. direct link)
    if pet_id in latest_pet_state:
        return latest_pet_state[pet_id]
        
    return {
        "pet_id": pet_id,
        "health_score": 98,
        "history": [],
        "alerts": []
    }
