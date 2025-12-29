"""
Confluent Kafka Producer - Streams simulated pet health data
Demonstrates real-time data ingestion for AI Partner Catalyst Hackathon

This module produces real-time pet health telemetry to Confluent Cloud,
simulating IoT sensors and smartphone-based activity tracking.
"""
from confluent_kafka import Producer
import json
import time
import random
from datetime import datetime
import os

# Confluent Cloud Configuration
# To use: Set environment variables or replace with your actual values
CONFLUENT_CONFIG = {
    'bootstrap.servers': os.getenv('CONFLUENT_BOOTSTRAP_SERVERS', 'YOUR_CONFLUENT_CLOUD_ENDPOINT'),
    'security.protocol': 'SASL_SSL',
    'sasl.mechanisms': 'PLAIN',
    'sasl.username': os.getenv('CONFLUENT_API_KEY', 'YOUR_API_KEY'),
    'sasl.password': os.getenv('CONFLUENT_API_SECRET', 'YOUR_API_SECRET'),
    # Additional performance configs
    'linger.ms': 10,
    'batch.size': 32768,
    'compression.type': 'snappy',
    'acks': 'all'  # Ensure durability
}

TOPIC = 'pet-health-stream'

def generate_pet_telemetry(pet_id="MAX_001", inject_anomaly=False):
    """
    Simulate real-time pet health telemetry.
    In production, this comes from IoT sensors/smartphone computer vision.

    Args:
        pet_id: Unique identifier for the pet
        inject_anomaly: If True, simulates a health anomaly

    Returns:
        dict: Pet health telemetry data point
    """
    # Normal baseline for healthy medium-sized dog
    baseline_hr = 90  # beats per minute
    baseline_activity = 75  # activity score 0-100
    baseline_gait = 0.95  # gait symmetry (1.0 = perfect)

    # Add realistic variance based on time of day
    current_time = datetime.utcnow()
    hour = current_time.hour

    # Dogs are more active during day (8am-8pm)
    activity_multiplier = 1.2 if 8 <= hour <= 20 else 0.6

    # Random anomaly injection (5% baseline probability)
    if not inject_anomaly:
        inject_anomaly = random.random() < 0.05

    # Simulate early warning signs of hip dysplasia
    if inject_anomaly:
        # Elevated heart rate from compensatory movement
        hr_delta = random.randint(15, 25)
        # Reduced activity due to discomfort
        activity_delta = -random.randint(20, 35)
        # Gait asymmetry from favoring one leg
        gait_delta = -random.uniform(0.15, 0.25)
        # Poor sleep quality from pain
        sleep_delta = -random.uniform(0.2, 0.4)
    else:
        hr_delta = random.randint(-10, 10)
        activity_delta = random.randint(-15, 15)
        gait_delta = random.uniform(-0.05, 0.05)
        sleep_delta = random.uniform(-0.1, 0.1)

    return {
        'pet_id': pet_id,
        'timestamp': current_time.isoformat(),
        'heart_rate': max(60, min(150, baseline_hr + hr_delta)),
        'activity_score': max(0, min(100, int((baseline_activity * activity_multiplier) + activity_delta))),
        'sleep_quality': max(0.0, min(1.0, random.uniform(0.7, 1.0) + sleep_delta)),
        'gait_symmetry': max(0.0, min(1.0, baseline_gait + gait_delta)),
        'anomaly_injected': inject_anomaly,
        'metadata': {
            'sensor_type': 'smartphone_cv' if random.random() > 0.3 else 'ble_collar',
            'confidence': random.uniform(0.85, 0.99)
        }
    }

def delivery_report(err, msg):
    """
    Callback for message delivery confirmation.
    Called once for each message produced to indicate success or failure.
    """
    if err is not None:
        print(f'❌ Message delivery failed: {err}')
    else:
        print(f'✅ Message delivered to {msg.topic()} [{msg.partition()}] @ offset {msg.offset()}')

def stream_pet_data(pet_id="MAX_001", duration_seconds=120, interval=2.0):
    """
    Stream pet health data to Confluent Cloud.

    Args:
        pet_id: Unique identifier for the pet
        duration_seconds: How long to stream data (default 120s for demo)
        interval: Seconds between data points (default 2s = realistic IoT frequency)
    """
    # Initialize Confluent Producer
    producer = Producer(CONFLUENT_CONFIG)

    print(f"🚀 Starting pet health stream to Confluent Cloud")
    print(f"📡 Topic: {TOPIC}")
    print(f"🐕 Pet ID: {pet_id}")
    print(f"⏱️  Duration: {duration_seconds} seconds")
    print(f"📊 Interval: {interval}s per data point")
    print("-" * 80)

    start_time = time.time()
    message_count = 0
    anomaly_count = 0

    try:
        while (time.time() - start_time) < duration_seconds:
            # Generate telemetry
            data = generate_pet_telemetry(pet_id)

            if data['anomaly_injected']:
                anomaly_count += 1
                print(f"⚠️  Injecting anomaly #{anomaly_count}")

            # Produce to Kafka
            producer.produce(
                TOPIC,
                key=data['pet_id'].encode('utf-8'),
                value=json.dumps(data).encode('utf-8'),
                callback=delivery_report
            )

            message_count += 1

            # Poll to handle delivery reports
            producer.poll(0)

            # Log current metrics
            print(f"📨 Message #{message_count} | HR: {data['heart_rate']} bpm | "
                  f"Activity: {data['activity_score']}/100 | Gait: {data['gait_symmetry']:.2f}")

            # Stream every N seconds (realistic IoT frequency)
            time.sleep(interval)

    except KeyboardInterrupt:
        print("\n⚠️  Stream interrupted by user")
    except Exception as e:
        print(f"\n❌ Error: {e}")
    finally:
        print(f"\n📊 Flushing {message_count} messages...")
        producer.flush(timeout=10)
        print(f"✅ Successfully streamed {message_count} health data points!")
        print(f"⚠️  Anomalies injected: {anomaly_count} ({anomaly_count/message_count*100:.1f}%)")

if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description='Stream pet health data to Confluent Cloud')
    parser.add_argument('--pet-id', default='MAX_001', help='Pet identifier')
    parser.add_argument('--duration', type=int, default=120, help='Duration in seconds')
    parser.add_argument('--interval', type=float, default=2.0, help='Interval between messages')

    args = parser.parse_args()

    stream_pet_data(
        pet_id=args.pet_id,
        duration_seconds=args.duration,
        interval=args.interval
    )
