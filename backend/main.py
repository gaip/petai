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

@app.get("/api/health/{pet_id}")
def get_health(pet_id: str):
    # In this Kafka architecture, the API serves the "Current State" 
    # which is updated asynchronously by the Consumer.
    
    # For demo purposes, if no data yet, return healthy
    if pet_id not in latest_pet_state:
        return {
            "pet_id": pet_id,
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
