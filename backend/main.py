from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from producer import MockKafkaProducer
from consumer import MockKafkaConsumer
import threading

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global State (Simulating Database/Cache updated by Consumer)
latest_pet_state = {
    "Max": {"health_score": 10.0, "history": [], "alerts": []}
}

def on_anomaly_detected(event):
    """Callback when consumer detects anomaly."""
    pet_id = event['pet_id']
    print(f"[Main] Global State Updated for {pet_id}: {event['alert']['text']}")
    
    # Update global state
    if pet_id not in latest_pet_state:
        latest_pet_state[pet_id] = {"health_score": 10.0, "history": [], "alerts": []}
        
    state = latest_pet_state[pet_id]
    state['health_score'] = event['score']
    state['alerts'].insert(0, {
        "title": "Anomaly Detected",
        "message": event['alert']['text'],
        "severity": event['alert']['severity'],
        "audio": event['alert']['audio_url']
    })
    # Keep last 5 alerts
    state['alerts'] = state['alerts'][:5]

# Initialize Infrastructure
producer = MockKafkaProducer("pet-health-stream")
consumer = MockKafkaConsumer(producer, "pet-health-stream")

# In-Memory Video Storage (Simulating GCS)
uploaded_videos = []

@app.on_event("startup")
def startup_event():
    print("Starting PetTwin Backend Services...")
    # Start producing data for Max (Simulated device)
    producer.start_producing("Max", interval_sec=5.0)
    
    # Start consuming and analyzing
    consumer.start_consuming(callback=on_anomaly_detected)

@app.on_event("shutdown")
def shutdown_event():
    producer.stop()
    consumer.stop()

@app.get("/")
def read_root():
    return {"status": "PetTwin Backend is running", "integrations": ["Confluent", "Datadog", "ElevenLabs"]}

@app.post("/api/pets")
def add_pet(name: str, breed: str, age: int):
    # Register new pet in global state and start producer
    pet_id = name.capitalize()
    if pet_id not in latest_pet_state:
        # Include breed/age in state for the portal to fetch
        latest_pet_state[pet_id] = {
            "name": pet_id,
            "breed": breed,
            "age": age,
            "health_score": 9.5, 
            "history": [], 
            "alerts": []
        }
        producer.start_producing(pet_id, interval_sec=5.0) # Start simulated stream
        print(f"[Backend] Registered new pet: {pet_id}")
    return {"status": "success", "pet_id": pet_id}

@app.get("/api/pets")
def list_pets():
    # Convert global state to list for the portal
    # Default mock data if empty (bootstrap)
    if "Max" not in latest_pet_state:
         latest_pet_state["Max"] = {"name": "Max", "breed": "Golden Retriever", "age": 7, "health_score": 9.8, "alerts": []}
         latest_pet_state["Charlie"] = {"name": "Charlie", "breed": "Labrador", "age": 5, "health_score": 8.5, "alerts": []}
    
    return [
        {
            "id": i, 
            "name": p["name"], 
            "breed": p.get("breed", "Unknown"), 
            "age": p.get("age", 0), 
            "risk": "Low" if p.get("health_score", 10) > 8 else "High",
            "lastVisit": "Today"
        } 
        for i, (k, p) in enumerate(latest_pet_state.items())
    ]

@app.post("/api/upload")
def upload_video(file: bytes = None): # In real app use UploadFile
    # Simulate processing video with Gemini 1.5 Pro
    # "Analyzing video frames for gait anomalies..."
    uploaded_videos.append("video_file")
    print("[Backend] Video uploaded and analyzed by Vertex AI (Simulated)")
    return {"status": "success", "analysis": "No immediate anomalies detected in gait."}

@app.get("/api/health/{pet_id}")
def get_health(pet_id: str):
    # Clean ID
    pet_id = pet_id.capitalize()
    
    # If pet doesn't exist, create default entry (for demo robustness)
    if pet_id not in latest_pet_state:
        latest_pet_state[pet_id] = {
            "health_score": 9.8,
            "history": [],
            "alerts": []
        }
        
    return {
        "pet_id": pet_id,
        "health_score": latest_pet_state[pet_id]['health_score'],
        "history": [], # In full version, read from Timeseries DB
        "alerts": latest_pet_state[pet_id]['alerts']
    }
