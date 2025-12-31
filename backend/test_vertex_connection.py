"""
Verify Vertex AI Connection & Gemini Pro
----------------------------------------
Tests the specific project configuration and model availability.
"""
import os
import sys

# Force specific project credentials
PROJECT_ID = "mindful-pillar-482716-r9"
LOCATION = "us-central1"

print(f"🔄 Initializing Vertex AI test for project: {PROJECT_ID}...")

try:
    import vertexai
    from vertexai.generative_models import GenerativeModel, GenerationConfig
    
    # 1. Initialize
    vertexai.init(project=PROJECT_ID, location=LOCATION)
    print("✅ Vertex AI SDK Initialized")
    
    # 2. Load Model
    # Using 'gemini-pro' as the most stable, universally available alias
    model_name = "gemini-pro"
    model = GenerativeModel(model_name)
    print(f"✅ Model Loaded: {model_name}")
    
    # 3. Test Generation
    print("🔄 Sending test prompt to Gemini (Real API Call)...")
    response = model.generate_content("Hello! Are you operational? Reply with 'Yes, I am online' and nothing else.")
    
    print("\n" + "="*50)
    print(f"🤖 RESPONSE: {response.text.strip()}")
    print("="*50 + "\n")
    
    print("🎉 SUCCESS: Vertex AI Integration is FULLY FUNCTIONAL!")
    
except Exception as e:
    print("\n❌ CONNECTION FAILED")
    print(f"Error details: {e}")
    sys.exit(1)
