"""
Confluent Kafka Consumer + Vertex AI Anomaly Detection
Real-time processing pipeline for AI Partner Catalyst Hackathon

This module consumes pet health telemetry from Confluent Cloud,
performs real-time anomaly detection, and generates natural language
alerts using Google Cloud Vertex AI Gemini.
"""
from confluent_kafka import Consumer, KafkaError
import json
from datetime import datetime
import numpy as np
from collections import deque
import os

# Confluent Configuration
# Confluent Configuration
bootstrap_servers = os.getenv('CONFLUENT_BOOTSTRAP_SERVERS')
api_key = os.getenv('CONFLUENT_API_KEY')
api_secret = os.getenv('CONFLUENT_API_SECRET')

if not bootstrap_servers or not api_key:
    print("⚠️  No Confluent Cloud credentials found. Defaulting to LOCAL KAFKA (Docker)...")
    CONFLUENT_CONFIG = {
        'bootstrap.servers': 'localhost:9092',
        'security.protocol': 'PLAINTEXT',
        'group.id': 'pettwin-ai-processor',
        'auto.offset.reset': 'earliest',
        'enable.auto.commit': True,
        'auto.commit.interval.ms': 5000
    }
else:
    print(f"✅ Using Confluent Cloud: {bootstrap_servers}")
    CONFLUENT_CONFIG = {
        'bootstrap.servers': bootstrap_servers,
        'security.protocol': 'SASL_SSL',
        'sasl.mechanisms': 'PLAIN',
        'sasl.username': api_key,
        'sasl.password': api_secret,
        'group.id': 'pettwin-ai-processor',
        'auto.offset.reset': 'earliest',
        'enable.auto.commit': True,
        'auto.commit.interval.ms': 5000
    }

TOPIC = 'pet-health-stream'

class RealTimeAnomalyDetector:
    """
    Streaming anomaly detection using rolling window statistics.
    Feeds anomalies to Vertex AI Gemini for natural language explanation.

    This implements a lightweight real-time algorithm suitable for edge deployment
    while leveraging cloud AI for interpretability.
    """
    def __init__(self, window_size=30, threshold=2.5):
        """
        Initialize the anomaly detector.

        Args:
            window_size: Number of data points for baseline calculation
                        (e.g., 30 data points @ 2s interval = 1 minute baseline)
            threshold: Z-score threshold for anomaly detection
                      (2.5 = ~98.8% confidence interval)
        """
        self.window_size = window_size
        self.threshold = threshold

        # Rolling windows for each metric
        self.heart_rate_window = deque(maxlen=window_size)
        self.activity_window = deque(maxlen=window_size)
        self.gait_window = deque(maxlen=window_size)
        self.sleep_window = deque(maxlen=window_size)

        # Try to initialize Gemini (gracefully fail if not configured)
        self.gemini_enabled = False
        try:
            from vertexai.generative_models import GenerativeModel
            from google.cloud import aiplatform

            project_id = os.getenv('GCP_PROJECT_ID')
            if project_id:
                aiplatform.init(project=project_id, location='us-central1')
                self.model = GenerativeModel("gemini-pro")
                self.gemini_enabled = True
                print("✅ Vertex AI Gemini initialized successfully")
        except Exception as e:
            print(f"⚠️  Vertex AI not configured (running in detection-only mode): {e}")

    def detect_anomaly(self, data):
        """
        Check if current data point is an anomaly compared to rolling baseline.

        Uses statistical process control (SPC) with Z-scores to detect
        deviations from normal behavior patterns.

        Args:
            data: Dict containing pet health metrics

        Returns:
            dict: Anomaly detection result with details
        """
        # Add to rolling windows
        self.heart_rate_window.append(data['heart_rate'])
        self.activity_window.append(data['activity_score'])
        self.gait_window.append(data['gait_symmetry'])
        self.sleep_window.append(data.get('sleep_quality', 0.8))

        # Need enough data for baseline
        if len(self.heart_rate_window) < self.window_size:
            return {
                'is_anomaly': False,
                'reason': f'Building baseline... ({len(self.heart_rate_window)}/{self.window_size})'
            }

        # Calculate Z-scores for each metric
        hr_zscore = self._calculate_zscore(data['heart_rate'], self.heart_rate_window)
        activity_zscore = self._calculate_zscore(data['activity_score'], self.activity_window)
        gait_zscore = self._calculate_zscore(data['gait_symmetry'], self.gait_window)
        sleep_zscore = self._calculate_zscore(data.get('sleep_quality', 0.8), self.sleep_window)

        # Detect anomalies (threshold exceeded)
        anomalies = []
        if abs(hr_zscore) > self.threshold:
            direction = "elevated" if hr_zscore > 0 else "depressed"
            anomalies.append(f"heart_rate_{direction} (z={hr_zscore:.2f})")

        if abs(activity_zscore) > self.threshold:
            direction = "elevated" if activity_zscore > 0 else "reduced"
            anomalies.append(f"activity_{direction} (z={activity_zscore:.2f})")

        if abs(gait_zscore) > self.threshold:
            direction = "improved" if gait_zscore > 0 else "asymmetric"
            anomalies.append(f"gait_{direction} (z={gait_zscore:.2f})")

        if abs(sleep_zscore) > self.threshold:
            direction = "improved" if sleep_zscore > 0 else "disrupted"
            anomalies.append(f"sleep_{direction} (z={sleep_zscore:.2f})")

        if anomalies:
            # Calculate composite severity score
            severity = max(abs(hr_zscore), abs(activity_zscore), abs(gait_zscore), abs(sleep_zscore))

            return {
                'is_anomaly': True,
                'anomaly_type': ', '.join(anomalies),
                'severity': severity,
                'z_scores': {
                    'heart_rate': hr_zscore,
                    'activity': activity_zscore,
                    'gait': gait_zscore,
                    'sleep': sleep_zscore
                },
                'data': data
            }

        return {'is_anomaly': False}

    def _calculate_zscore(self, value, window):
        """
        Calculate Z-score for current value vs rolling window baseline.

        Z-score = (value - mean) / std_dev

        Args:
            value: Current metric value
            window: Rolling window of historical values

        Returns:
            float: Z-score (number of standard deviations from mean)
        """
        mean = np.mean(window)
        std = np.std(window)
        if std == 0:
            return 0
        return (value - mean) / std

    def generate_alert_message(self, anomaly_result):
        """
        Use Vertex AI Gemini to generate human-friendly alert from anomaly data.

        This demonstrates the power of combining real-time streaming (Confluent)
        with generative AI (Vertex AI) to create actionable insights.

        Args:
            anomaly_result: Dict containing anomaly detection results

        Returns:
            str: Natural language alert message
        """
        if not self.gemini_enabled:
            return self._generate_simple_alert(anomaly_result)

        prompt = f"""You are a veterinary AI assistant analyzing real-time pet health data.

ANOMALY DETECTED:
- Anomaly Type: {anomaly_result['anomaly_type']}
- Severity Score: {anomaly_result['severity']:.2f} (higher = more concerning)
- Z-Scores: {json.dumps(anomaly_result['z_scores'], indent=2)}
- Current Metrics:
  * Heart Rate: {anomaly_result['data']['heart_rate']} bpm
  * Activity Score: {anomaly_result['data']['activity_score']}/100
  * Gait Symmetry: {anomaly_result['data']['gait_symmetry']:.2f}
  * Sleep Quality: {anomaly_result['data'].get('sleep_quality', 'N/A')}

TASK: Write a SHORT (2-3 sentences) alert message for the pet owner.

Requirements:
- Be calm but appropriately urgent
- Explain what the anomaly means in simple, non-technical language
- Suggest immediate action based on severity:
  * Severity > 3.5: "Contact your vet today"
  * Severity 2.5-3.5: "Monitor closely for 24-48 hours"
  * Severity < 2.5: "Keep an eye on these patterns"
- NO medical jargon
- Focus on observable behaviors the owner can relate to

Alert Message:"""

        try:
            response = self.model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            print(f"⚠️  Gemini API error: {e}")
            return self._generate_simple_alert(anomaly_result)

    def _generate_simple_alert(self, anomaly_result):
        """Fallback alert generation without Gemini."""
        severity = anomaly_result['severity']
        anomaly_type = anomaly_result['anomaly_type']

        if severity > 3.5:
            urgency = "⚠️ HIGH PRIORITY"
            action = "Contact your veterinarian today"
        elif severity > 2.5:
            urgency = "⚡ ATTENTION NEEDED"
            action = "Monitor your pet closely for the next 24-48 hours"
        else:
            urgency = "ℹ️ NOTICE"
            action = "Keep an eye on these patterns"

        return f"{urgency}: Detected {anomaly_type}. {action}."

def consume_and_analyze():
    """
    Main consumer loop: Reads from Confluent, detects anomalies, generates alerts.

    This demonstrates a complete real-time AI pipeline:
    1. Confluent Cloud ingests streaming data
    2. Consumer processes data in real-time
    3. Anomaly detection identifies deviations
    4. Vertex AI Gemini generates natural language alerts
    """
    consumer = Consumer(CONFLUENT_CONFIG)
    consumer.subscribe([TOPIC])

    detector = RealTimeAnomalyDetector(window_size=30, threshold=2.5)

    print("=" * 80)
    print("🐾 PetTwin Care - Real-Time AI Health Monitoring")
    print("🎧 Listening to pet health stream from Confluent Cloud...")
    print("🧠 Vertex AI anomaly detection: " + ("ACTIVE" if detector.gemini_enabled else "DETECTION ONLY"))
    print("=" * 80)

    message_count = 0
    anomaly_count = 0

    try:
        while True:
            msg = consumer.poll(timeout=1.0)

            if msg is None:
                continue
            if msg.error():
                if msg.error().code() == KafkaError._PARTITION_EOF:
                    print(f"ℹ️  Reached end of partition {msg.partition()}")
                else:
                    print(f"❌ Consumer error: {msg.error()}")
                continue

            # Parse message
            try:
                data = json.loads(msg.value().decode('utf-8'))
            except json.JSONDecodeError as e:
                print(f"❌ Invalid JSON: {e}")
                continue

            message_count += 1

            print(f"\n{'─' * 80}")
            print(f"📨 Message #{message_count} | Pet: {data['pet_id']} | Time: {data['timestamp']}")
            print(f"   💓 HR: {data['heart_rate']} bpm | 🏃 Activity: {data['activity_score']}/100 | "
                  f"🦴 Gait: {data['gait_symmetry']:.2f} | 😴 Sleep: {data.get('sleep_quality', 'N/A')}")

            # Run anomaly detection
            result = detector.detect_anomaly(data)

            if result['is_anomaly']:
                anomaly_count += 1
                print(f"\n🚨 ANOMALY #{anomaly_count} DETECTED!")
                print(f"   📊 Type: {result['anomaly_type']}")
                print(f"   ⚡ Severity: {result['severity']:.2f}")
                print(f"   📉 Z-Scores: {result['z_scores']}")

                # Generate human-friendly alert via Gemini
                print(f"\n🤖 Generating owner alert via Vertex AI Gemini...")
                alert_message = detector.generate_alert_message(result)
                print(f"\n💬 ALERT MESSAGE:")
                print(f"{'═' * 80}")
                print(alert_message)
                print(f"{'═' * 80}\n")
            else:
                if 'reason' in result:
                    print(f"   ℹ️  {result['reason']}")
                else:
                    print(f"   ✅ Normal baseline")

    except KeyboardInterrupt:
        print(f"\n\n{'═' * 80}")
        print(f"📊 SESSION SUMMARY")
        print(f"{'═' * 80}")
        print(f"   Total messages processed: {message_count}")
        print(f"   Anomalies detected: {anomaly_count}")
        if message_count > 0:
            print(f"   Detection rate: {(anomaly_count/message_count*100):.1f}%")
        print(f"{'═' * 80}")
    finally:
        consumer.close()
        print("\n✅ Consumer closed gracefully")

if __name__ == "__main__":
    # Environment variables needed:
    # - CONFLUENT_BOOTSTRAP_SERVERS
    # - CONFLUENT_API_KEY
    # - CONFLUENT_API_SECRET
    # - GCP_PROJECT_ID (optional, for Gemini)
    # - GOOGLE_APPLICATION_CREDENTIALS (optional, for Gemini)

    consume_and_analyze()
