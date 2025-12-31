from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"status": "PetTwin AI Backend is running", "stack": "Python, TensorFlow, FastAPI"}

def test_list_pets():
    response = client.get("/api/pets")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 2 # Max and Charlie

def test_create_pet():
    response = client.post("/api/pets?name=Buddy&breed=Beagle&age=3")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["petId"] == "Buddy"

def test_get_health_existing():
    response = client.get("/api/health/Max")
    assert response.status_code == 200
    data = response.json()
    assert data["pet_id"] == "Max"
    assert "health_score" in data

def test_get_health_new():
    # Should generate default/mock data
    response = client.get("/api/health/UnknownDog")
    assert response.status_code == 200
    data = response.json()
    assert data["pet_id"] == "Unknowndog" or data["pet_id"] == "UnknownDog" # Capitalization check
    assert data["breed"] == "Unknown Breed"
