"""
Confluent Kafka Consumer + Vertex AI Anomaly Detection (Production Grade)
This script consumes pet health data from Confluent Cloud, detects anomalies
using statistical methods, and uses the AIEngine to generate intelligent alerts.
"""
import os
import json
import logging
from collections import deque
from typing import Dict, Any, Optional
import numpy as np
from confluent_kafka import Consumer, KafkaError
import threading
from http.server import HTTPServer, BaseHTTPRequestHandler

# Import the new AIEngine
from .ai_engine import AIEngine

# Datadog APM Integration
try:
    from datadog_apm_config import configure_datadog
except ImportError:
    # Fallback if config is missing (local dev without ddtrace)
    def configure_datadog(): pass


# Configure professional logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s | %(levelname)s | %(message)s',
    datefmt='%H:%M:%S'
)
# Create a logger for the application
logger = logging.getLogger("PetTwinAI")
# Set the logger for the AI Engine to the same level
logging.getLogger("PetTwinAI.ai_engine").setLevel(logging.INFO)


# --- Configuration ---
# GCP Project ID is now loaded from environment variables for security and flexibility
PROJECT_ID = os.getenv("GCP_PROJECT_ID", "default-project-id")
LOCATION = "us-central1"
TOPIC = 'pet-health-stream'


class AnomalyDetector:
    """
    Performs statistical anomaly detection and uses an AIEngine for intelligent analysis.
    """
    
    def __init__(self, ai_engine: AIEngine, window_size=30, z_threshold=2.5):
        self.ai_engine = ai_engine
        self.window_size = window_size
        self.threshold = z_threshold
        self.history = {
            'heart_rate': deque(maxlen=window_size),
            'activity': deque(maxlen=window_size),
            'gait': deque(maxlen=window_size)
        }
        logger.info("✅ Anomaly Detector initialized and linked with AIEngine.")

    def analyze(self, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Analyzes a single data point. If an anomaly is detected, it is enriched
        by the AIEngine.
        """
        # Update historical data windows
        self.history['heart_rate'].append(data.get('heart_rate', 0))
        self.history['activity'].append(data.get('activity_score', 0))
        self.history['gait'].append(data.get('gait_symmetry', 1.0))

        # We need a sufficient baseline before we can detect anomalies
        if len(self.history['heart_rate']) < 10:
            return None

        # Calculate Z-Scores for each metric
        z_scores = {}
        anomalies = []
        
        for metric, values in self.history.items():
            if len(values) < 2: continue

            # The baseline should be calculated on the historical data *before* the current value.
            baseline_values = list(values)[:-1]
            current_val = values[-1]

            mean = np.mean(baseline_values)
            std = np.std(baseline_values)
            
            if std == 0: continue # Avoid division by zero if all values are the same
            
            z = (current_val - mean) / std
            z_scores[metric] = round(z, 2)
            
            # If the Z-score exceeds the threshold, it's an anomaly
            if abs(z) > self.threshold:
                anomalies.append(f"{metric} (z={z:.1f})")

        # If any anomalies were found, prepare the data for AI analysis
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
            
            # Delegate the complex reasoning to the AIEngine
            ai_analysis = self.ai_engine.analyze_anomaly(result)
            return {**result, "ai_analysis": ai_analysis}
            
        return None


def get_confluent_config() -> Dict[str, Any]:
    """Builds the configuration dictionary for connecting to Confluent Cloud or a local Kafka."""
    bootstrap = os.getenv('CONFLUENT_BOOTSTRAP_SERVERS')
    api_key = os.getenv('CONFLUENT_API_KEY')
    api_secret = os.getenv('CONFLUENT_API_SECRET')

    if bootstrap and api_key and api_secret:
        logger.info(f"☁️ Connecting to Confluent Cloud: {bootstrap}")
        return {
            'bootstrap.servers': bootstrap,
            'security.protocol': 'SASL_SSL',
            'sasl.mechanisms': 'PLAIN',
            'sasl.username': api_key,
            'sasl.password': api_secret,
            'group.id': 'pettwin-ai-consumer-v3',  # Incremented group id
            'auto.offset.reset': 'latest',
            'enable.auto.commit': True
        }
    else:
        logger.warning("⚠️ Confluent Cloud credentials not found. Using localhost Kafka.")
        return {
            'bootstrap.servers': 'localhost:9092',
            'security.protocol': 'PLAINTEXT',
            'group.id': 'pettwin-local-group',
            'auto.offset.reset': 'latest'
        }


class HealthCheckHandler(BaseHTTPRequestHandler):
    """A simple HTTP server for Cloud Run health checks."""
    def do_GET(self):
        self.send_response(200)
        self.end_headers()
        self.wfile.write(b"OK")
    
    def log_message(self, format, *args):
        return  # Suppress log messages for health checks


def start_health_check_server():
    """Starts the health check server in a background thread."""
    port = int(os.environ.get("PORT", 8080))
    server = HTTPServer(('0.0.0.0', port), HealthCheckHandler)
    logger.info(f"🏥 Health check server listening on port {port}")
    server.serve_forever()


def main():
    """The main entry point of the application."""
    # Initialize Datadog Tracing
    configure_datadog()
    
    logger.info("🚀 Starting PetTwin AI Processor (Refactored)...")

    # Start the health check server in a daemon thread
    health_thread = threading.Thread(target=start_health_check_server, daemon=True)
    health_thread.start()

    # Initialize the AI Engine
    ai_engine = AIEngine(project_id=PROJECT_ID, location=LOCATION)

    # Initialize the Anomaly Detector with the AI Engine
    detector = AnomalyDetector(ai_engine=ai_engine)
    
    # Configure and start the Kafka consumer
    conf = get_confluent_config()
    consumer = Consumer(conf)
    consumer.subscribe([TOPIC])
    
    logger.info(f"🎧 Listening for messages on topic '{TOPIC}'...")

    try:
        while True:
            msg = consumer.poll(timeout=1.0)
            
            if msg is None:
                continue
            if msg.error():
                if msg.error().code() != KafkaError._PARTITION_EOF:
                    logger.error(f"Kafka Error: {msg.error()}")
                continue
                
            try:
                data = json.loads(msg.value().decode('utf-8'))
                alert = detector.analyze(data)
                
                if alert and alert.get("ai_analysis"):
                    ai = alert['ai_analysis']
                    log_message = (
                        f"\n============================================================\n"
                        f"🚨 AGENT ALERT ({ai_engine.model_name}): {ai.get('alert_title', 'N/A')} "
                        f"({ai.get('severity_level', 'N/A')})\n"
                        f"📝 Reasoning: {ai.get('medical_explanation', 'N/A')}\n"
                        f"============================================================"
                    )
                    logger.info(log_message)

            except json.JSONDecodeError:
                logger.error(f"Failed to decode JSON message: {msg.value()}")
            except Exception as e:
                logger.exception(f"An unexpected error occurred while processing message: {e}")

    except KeyboardInterrupt:
        logger.info("Shutdown signal received.")
    finally:
        consumer.close()
        logger.info("Kafka consumer closed. Exiting.")


if __name__ == "__main__":
    main()
