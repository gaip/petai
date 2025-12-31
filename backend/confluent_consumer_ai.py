"""
Confluent Kafka Consumer + Vertex AI Anomaly Detection (Production Grade)
Real-time processing pipeline for AI Partner Catalyst Hackathon.

Features:
- Confluent Cloud: SASL_SSL, optimized batching, auto-reconnect
- Vertex AI: Gemini 1.5 Pro (Agentic Mode) for reasoning-based analysis
- Datadog Observability: Comprehensive metrics and monitoring
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

# Datadog Integration - Metrics
try:
    from datadog import statsd
    DATADOG_ENABLED = True
    # Configure Datadog StatsD client
    statsd.host = os.getenv('DD_AGENT_HOST', 'localhost')
    statsd.port = int(os.getenv('DD_AGENT_PORT', 8125))
    statsd.namespace = 'pettwin'
    logging.info("✅ Datadog metrics enabled")
except ImportError:
    DATADOG_ENABLED = False
    logging.warning("⚠️ Datadog library not found. Install with: pip install datadog")
    # Create dummy statsd for graceful degradation
    class DummyStatsd:
        def histogram(self, *args, **kwargs): pass
        def gauge(self, *args, **kwargs): pass
        def increment(self, *args, **kwargs): pass
        def decrement(self, *args, **kwargs): pass
    statsd = DummyStatsd()

# Datadog APM & AI Observability
try:
    from datadog_apm_config import (
        initialize_apm,
        initialize_llm_observability,
        trace_vertex_ai_call,
        trace_kafka_operation,
        annotate_llm_call
    )
    APM_ENABLED = initialize_apm()
    LLM_OBS_ENABLED = initialize_llm_observability()
except ImportError:
    logging.info("ℹ️  APM/LLM Observability not configured (optional)")
    APM_ENABLED = False
    LLM_OBS_ENABLED = False
    # Dummy decorators
    def trace_vertex_ai_call(func): return func
    def trace_kafka_operation(name): return lambda func: func
    def annotate_llm_call(*args, **kwargs): pass

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
try:
    import vertexai
    from vertexai.generative_models import GenerativeModel, GenerationConfig
    
    vertexai.init(project=PROJECT_ID, location=LOCATION)
    
    # Use Gemini Pro to support advanced reasoning prompts
    MODEL_NAME = "gemini-pro"
    
    # Enforce JSON output for reliable parsing
    generation_config = GenerationConfig(
        temperature=0.4,
        top_p=0.8,
        top_k=40,
        response_mime_type="application/json",
        max_output_tokens=1024,
    )
    
    # AGENTIC SYSTEM INSTRUCTION (Vertex AI Agent Engine Style)
    model = GenerativeModel(
        model_name=MODEL_NAME,
        system_instruction="""You are the PetTwin Virtual Veterinarian Agent (powered by Vertex AI).
        
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
    )
    GEMINI_ENABLED = True
    logger.info(f"✅ Vertex AI Agent initialized: {MODEL_NAME} @ {PROJECT_ID}")

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
        # Accuracy tracking for Datadog
        self.total_detections = 0
        self.true_positives = 0
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

            # Track detection accuracy for Datadog
            self.total_detections += 1
            # Assume true positive if anomaly was injected (for demo/validation)
            if data.get('anomaly_injected', False):
                self.true_positives += 1

            # Send accuracy metric to Datadog
            if self.total_detections > 0:
                accuracy = (self.true_positives / self.total_detections) * 100
                statsd.gauge('pet.health.anomaly.accuracy', accuracy,
                           tags=[f'pet:{data.get("pet_id", "unknown")}'])

            # Send anomaly count
            statsd.increment('pet.health.anomaly.detected',
                           tags=[f'severity:{severity:.1f}', f'pet:{data.get("pet_id")}'])

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
            response = model.generate_content(
                prompt,
                generation_config=generation_config
            )
            latency = (time.time() - start_time) * 1000

            ai_response = json.loads(response.text)
            logger.info(f"🧠 Vertex AI Agent Reasoned in {latency:.0f}ms")

            # Send Vertex AI latency to Datadog
            statsd.histogram('vertex.ai.inference.latency', latency,
                           tags=['model:gemini-pro', f'pet:{analysis_result.get("pet_id")}'])

            # Track successful AI inference
            statsd.increment('vertex.ai.inference.success',
                           tags=['model:gemini-pro'])

            # AI Observability - Track LLM call
            if LLM_OBS_ENABLED:
                annotate_llm_call(
                    prompt=prompt,
                    response=response.text,
                    model="gemini-pro"
                )

            return {**analysis_result, "ai_analysis": ai_response}
            
        except Exception as e:
            logger.error(f"⚠️ Vertex AI Error: {e}")
            # Track AI errors in Datadog
            statsd.increment('vertex.ai.inference.error',
                           tags=['model:gemini-pro', f'error_type:{type(e).__name__}'])
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
    logger.info("🚀 Starting PetTwin AI Processor (Agentic Mode)...")

    conf = get_confluent_config()
    consumer = Consumer(conf)
    consumer.subscribe([TOPIC])

    detector = AnomalyDetector()

    logger.info(f"🎧 Listening on topic '{TOPIC}'...")

    # Metrics tracking
    messages_processed = 0
    last_metric_time = time.time()

    try:
        while True:
            msg = consumer.poll(timeout=1.0)

            if msg is None:
                # Send heartbeat metric to Datadog every 10 seconds
                if time.time() - last_metric_time > 10:
                    statsd.gauge('kafka.consumer.active', 1, tags=[f'topic:{TOPIC}'])
                    last_metric_time = time.time()
                continue

            if msg.error():
                if msg.error().code() == KafkaError._PARTITION_EOF: continue
                logger.error(f"Kafka Error: {msg.error()}")
                statsd.increment('kafka.consumer.error',
                               tags=[f'error:{msg.error().code()}'])
                continue

            try:
                # Track message processing
                process_start = time.time()
                messages_processed += 1

                # Parse Data
                raw_val = msg.value().decode('utf-8')
                data = json.loads(raw_val)

                # Send Kafka metrics to Datadog
                statsd.increment('kafka.messages.consumed',
                               tags=[f'topic:{TOPIC}', f'pet:{data.get("pet_id")}'])

                # Track consumer lag (approximate based on timestamp)
                if 'timestamp' in data:
                    try:
                        from datetime import datetime
                        msg_time = datetime.fromisoformat(data['timestamp'].replace('Z', '+00:00'))
                        lag_ms = (datetime.utcnow() - msg_time.replace(tzinfo=None)).total_seconds() * 1000
                        statsd.histogram('kafka.consumer.lag', lag_ms,
                                       tags=[f'topic:{TOPIC}'])
                    except:
                        pass

                # Analyze
                alert = detector.analyze(data)

                # Track processing time
                process_time = (time.time() - process_start) * 1000
                statsd.histogram('pet.health.processing.latency', process_time,
                               tags=[f'pet:{data.get("pet_id")}'])

                if alert:
                    # Log the alert (In prod, this would push to Firestore/Frontend)
                    ai = alert['ai_analysis']
                    logger.info("\n" + "="*60)
                    logger.info(f"🚨 AGENT ALERT: {ai['alert_title']} ({ai['severity_level']})")
                    logger.info(f"📝 Reasoning: {ai['medical_explanation']}")
                    logger.info(f"👉 Action: {ai['recommended_action']}")
                    logger.info(f"📊 Stats: {alert['anomalies']}")
                    logger.info("="*60 + "\n")
                else:
                    # Heartbeat log every 50 msgs or verbose
                    if int(time.time()) % 10 == 0:
                        logger.debug(f"Processing: {data['pet_id']} - Nominal")

            except json.JSONDecodeError:
                logger.error("Failed to decode JSON message")
                statsd.increment('pet.health.processing.error',
                               tags=['error_type:json_decode'])
            except Exception as e:
                logger.error(f"Processing Error: {e}")
                statsd.increment('pet.health.processing.error',
                               tags=[f'error_type:{type(e).__name__}'])

    except KeyboardInterrupt:
        logger.info("Stopping...")
    finally:
        consumer.close()
        logger.info("Consumer closed.")

if __name__ == "__main__":
    main()
