"""
Confluent Kafka Consumer + Vertex AI Anomaly Detection (Production Grade)
Real-time processing pipeline for AI Partner Catalyst Hackathon.

Features:
- Confluent Cloud: SASL_SSL, optimized batching, auto-reconnect
- Vertex AI: Gemini 2.0/1.5 (Agentic Mode) for reasoning-based analysis
- Output: Structured JSON for direct frontend consumption
"""
import os
import json
import logging
import time
from collections import deque
from typing import Dict, Any, Optional
import numpy as np
from confluent_kafka import Consumer, KafkaError
import threading
from http.server import HTTPServer, BaseHTTPRequestHandler

# Datadog APM Integration
try:
    from datadog_apm_config import configure_datadog, trace_vertex_ai_call
except ImportError:
    # Fallback if config is missing (local dev without ddtrace)
    def configure_datadog(): pass
    def trace_vertex_ai_call(func): return func


# Configure professional logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s | %(levelname)s | %(message)s',
    datefmt='%H:%M:%S'
)
logger = logging.getLogger("PetTwinAI")

# --- Configuration ---
PROJECT_ID = "mindful-pillar-482716-r9"  # Verified Project ID
LOCATION = "us-central1"
TOPIC = 'pet-health-stream'

# Initialize Vertex AI
GEMINI_ENABLED = False
try:
    import vertexai
    from vertexai.generative_models import GenerativeModel, GenerationConfig
    
    vertexai.init(project=PROJECT_ID, location=LOCATION)
    
    # --- MODEL SELECTION (Cutting Edge) ---
    # Trying the latest available models (Gemini 2.0 Flash Exp / 1.5 Pro)
    POSSIBLE_MODELS = [
        "gemini-2.0-flash-exp", # Next-Gen Reasoner
        "gemini-1.5-pro-002",   # Stable High Intelligence
        "gemini-1.5-flash-002", # Fast
        "gemini-pro"            # Legacy Fallback
    ]
    
    MODEL_NAME = "gemini-pro" # Default
    
    # Enforce JSON output for reliable parsing
    generation_config = GenerationConfig(
        temperature=0.3, 
        top_p=0.95,
        response_mime_type="application/json",
        max_output_tokens=2048,
    )
    
    # AGENTIC SYSTEM INSTRUCTION
    SYSTEM_INSTRUCTION = """You are the PetTwin Virtual Veterinarian Agent (powered by Vertex AI).
        
    Your Goal: specific, actionable, and empathetic veterinary analysis.
    
    AGENT REASONING PROTOCOL:
    1. OBSERVE: Analyze the Z-Scores and metrics.
    2. REASON: Determine the likely physiological cause (e.g., pain, stress, infection).
    3. ACT: Generate a structured JSON alert.
    
    Your output MUST be a valid JSON object with the following schema:
    {
        "alert_title": "Short, urgent title (e.g., 'High Heart Rate Detected')",
        "severity_level": "LOW|MEDIUM|HIGH|CRITICAL",
        "medical_explanation": "Simple, non-jargon explanation for the owner (1 sentence)",
        "recommended_action": "Clear, actionable advice (e.g., 'Contact your vet today')",
        "confidence_score": 0.0-1.0
    }
    ALWAYS return PURE JSON. Do not use markdown blocks."""

    # Select best model
    model = None
    for m in POSSIBLE_MODELS:
        try:
            # Attempt init
            temp_model = GenerativeModel(model_name=m, system_instruction=SYSTEM_INSTRUCTION)
            MODEL_NAME = m
            model = temp_model
            logger.info(f"✅ Selected Cutting-Edge Model: {MODEL_NAME}")
            GEMINI_ENABLED = True
            break
        except Exception:
            continue
            
    if not GEMINI_ENABLED:
        # Fallback to base
        logger.warning("⚠️ Could not load specific models, trying default gemini-pro")
        model = GenerativeModel("gemini-pro", system_instruction=SYSTEM_INSTRUCTION)
        GEMINI_ENABLED = True

except ImportError:
    logger.error("❌ google-cloud-aiplatform not installed. Running in limited mode.")
    GEMINI_ENABLED = False
except Exception as e:
    logger.error(f"❌ Vertex AI initialization failed: {e}")
    GEMINI_ENABLED = False

class AnomalyDetector:
    """Statistical Anomaly Detector with Vertex AI Explanation"""
    
    def __init__(self, window_size=30, z_threshold=2.5):
        self.window_size = window_size
        self.threshold = z_threshold
        self.history = {
            'heart_rate': deque(maxlen=window_size),
            'activity': deque(maxlen=window_size),
            'gait': deque(maxlen=window_size)
        }
        logger.info("✅ Anomaly Detector initialized")

    def analyze(self, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Analyze a single data point. Returns result dict if anomaly detected, else None.
        """
        # Update history
        self.history['heart_rate'].append(data.get('heart_rate', 0))
        self.history['activity'].append(data.get('activity_score', 0))
        self.history['gait'].append(data.get('gait_symmetry', 1.0))

        # Need baseline
        if len(self.history['heart_rate']) < 10:
            return None

        # Calculate Z-Scores
        z_scores = {}
        anomalies = []
        
        for metric, values in self.history.items():
            if not values: continue
            mean = np.mean(values)
            std = np.std(values)
            
            if std == 0: continue
            
            current_val = self.history[metric][-1]
            z = (current_val - mean) / std
            z_scores[metric] = round(z, 2)
            
            if abs(z) > self.threshold:
                anomalies.append(f"{metric} (z={z:.1f})")

        # If anomalies found, enrich with Vertex AI
        if anomalies:
            severity = max([abs(v) for v in z_scores.values()] + [0])
            result = {
                "timestamp": data.get('timestamp'),
                "pet_id": data.get('pet_id'),
                "anomalies": anomalies,
                "z_scores": z_scores,
                "metrics": data,
                "max_severity_z": severity
            }
            return self._enrich_with_ai(result)
            
        return None

    @trace_vertex_ai_call
    def _enrich_with_ai(self, analysis_result: Dict[str, Any]) -> Dict[str, Any]:
        """Send anomaly data to Vertex AI Gemini for interpretation"""
        if not GEMINI_ENABLED:
            # Fallback for when AI is offline
            return {**analysis_result, "ai_analysis": self._fallback_analysis(analysis_result)}

        prompt = f"""
        Analyze this anomaly event for Pet {analysis_result['pet_id']}:
        
        [OBSERVATION]
        - Anomalies: {analysis_result['anomalies']}
        - Severity (Z-Score): {analysis_result['max_severity_z']:.2f}
        - Current Metrics: {json.dumps(analysis_result['metrics'])}
        
        [CONTEXT]
        - Heart Rate baseline: ~90bpm
        - Activity: 0-100 score
        - Gait: 1.0 is perfect symmetry
        
        [TASK]
        Apply veterinary reasoning to determine the urgency and cause.
        """
        
        try:
            start_time = time.time()
            # Note: We must create a new request but reuse the config
            response = model.generate_content(
                prompt,
                generation_config=generation_config
            )
            latency = (time.time() - start_time) * 1000
            
            ai_response = json.loads(response.text)
            logger.info(f"🧠 Vertex AI Agent ({MODEL_NAME}) Reasoned in {latency:.0f}ms")
            
            return {**analysis_result, "ai_analysis": ai_response}
            
        except Exception as e:
            logger.error(f"⚠️ Vertex AI Error: {e}")
            return {**analysis_result, "ai_analysis": self._fallback_analysis(analysis_result)}

    def _fallback_analysis(self, result):
        return {
            "alert_title": f"Anomaly Detected: {', '.join(result['anomalies'])}",
            "severity_level": "MEDIUM",
            "medical_explanation": "Statistical deviation detected in vitals.",
            "recommended_action": "Monitor closely.",
            "confidence_score": 1.0
        }

def get_confluent_config():
    """Get production configuration for Confluent Cloud"""
    bootstrap = os.getenv('CONFLUENT_BOOTSTRAP_SERVERS')
    api_key = os.getenv('CONFLUENT_API_KEY')
    api_secret = os.getenv('CONFLUENT_API_SECRET')

    if bootstrap and api_key:
        logger.info(f"☁️ Connecting to Confluent Cloud: {bootstrap}")
        return {
            'bootstrap.servers': bootstrap,
            'security.protocol': 'SASL_SSL',
            'sasl.mechanisms': 'PLAIN',
            'sasl.username': api_key,
            'sasl.password': api_secret,
            'group.id': 'pettwin-ai-consumer-v2',
            'auto.offset.reset': 'latest', # Real-time focus
            'enable.auto.commit': True
        }
    else:
        logger.warning("⚠️ No Cloud Credentials. Using Localhost Kafka.")
        return {
            'bootstrap.servers': 'localhost:9092',
            'security.protocol': 'PLAINTEXT',
            'group.id': 'pettwin-local-group',
            'auto.offset.reset': 'latest'
        }

# ==========================================
# 🏥 CLOUD RUN HEALTH CHECK SERVER
# ==========================================
class HealthCheckHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.end_headers()
        self.wfile.write(b"OK")
    
    def log_message(self, format, *args):
        return # Silence health check logs

def start_health_check_server():
    port = int(os.environ.get("PORT", 8080))
    server = HTTPServer(('0.0.0.0', port), HealthCheckHandler)
    logger.info(f"🏥 Health check server listening on port {port}")
    server.serve_forever()

# Start health check in background thread
health_thread = threading.Thread(target=start_health_check_server, daemon=True)
health_thread.start()
# ==========================================

def main():
    # Initialize Datadog Tracing
    configure_datadog()
    
    logger.info("🚀 Starting PetTwin AI Processor (Agentic Mode)...")
    
    conf = get_confluent_config()
    consumer = Consumer(conf)
    consumer.subscribe([TOPIC])
    
    detector = AnomalyDetector()
    
    logger.info(f"🎧 Listening on topic '{TOPIC}'...")

    try:
        while True:
            msg = consumer.poll(timeout=1.0)
            
            if msg is None: continue
            if msg.error():
                if msg.error().code() == KafkaError._PARTITION_EOF: continue
                logger.error(f"Kafka Error: {msg.error()}")
                continue
                
            try:
                # Parse Data
                raw_val = msg.value().decode('utf-8')
                data = json.loads(raw_val)
                
                # Analyze
                alert = detector.analyze(data)
                
                if alert:
                    # Log the alert (In prod, this would push to Firestore/Frontend)
                    ai = alert['ai_analysis']
                    logger.info("\n" + "="*60)
                    logger.info(f"🚨 AGENT ALERT ({MODEL_NAME}): {ai['alert_title']} ({ai['severity_level']})")
                    logger.info(f"📝 Reasoning: {ai['medical_explanation']}")
                    logger.info("="*60 + "\n")

            except json.JSONDecodeError:
                logger.error("Failed to decode JSON message")
            except Exception as e:
                logger.error(f"Processing Error: {e}")

    except KeyboardInterrupt:
        logger.info("Stopping...")
    finally:
        consumer.close()
        logger.info("Consumer closed.")

if __name__ == "__main__":
    main()
