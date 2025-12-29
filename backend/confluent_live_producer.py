#!/usr/bin/env python3
"""
Production Confluent Cloud Producer for PetTwin Care
Streams 24/7 live pet health telemetry to demonstrate real-time integration

Run this continuously to show judges live data flowing through Confluent Cloud dashboard
"""

import os
import json
import time
import random
from datetime import datetime
from typing import Dict, Optional
from confluent_kafka import Producer
import numpy as np


class PetHealthSimulator:
    """Simulates realistic pet health telemetry with gradual deterioration patterns"""

    def __init__(self, pet_id: str, breed: str, age_years: int, condition: Optional[str] = None):
        self.pet_id = pet_id
        self.breed = breed
        self.age_years = age_years
        self.condition = condition  # e.g., "early_arthritis"

        # Baseline vitals (breed-specific)
        self.baseline_hr = self._get_baseline_hr()
        self.baseline_activity = 75  # 0-100 scale
        self.baseline_gait = 0.95    # 0-1 symmetry
        self.baseline_sleep = 0.82   # 0-1 quality

        # Deterioration tracking
        self.days_elapsed = 0
        self.anomaly_progression = 0.0  # 0 to 1

    def _get_baseline_hr(self) -> int:
        """Breed-specific resting heart rate"""
        breed_hr = {
            "golden_retriever": 70,
            "chihuahua": 120,
            "german_shepherd": 75,
            "beagle": 80
        }
        return breed_hr.get(self.breed.lower(), 80)

    def _apply_condition_effects(self, data: Dict) -> Dict:
        """Apply realistic disease progression over time"""
        if not self.condition:
            return data

        # Simulate gradual deterioration (14 days = full progression)
        self.anomaly_progression = min(1.0, self.days_elapsed / 14.0)

        if self.condition == "early_arthritis":
            # Day 1-3: Subtle gait changes
            if self.anomaly_progression < 0.2:
                data['gait_symmetry'] -= random.uniform(0.02, 0.05)

            # Day 4-7: Activity reduction starts
            elif self.anomaly_progression < 0.5:
                data['gait_symmetry'] -= random.uniform(0.08, 0.15)
                data['activity_score'] -= random.uniform(5, 12)

            # Day 8-10: Pain compensation (elevated HR during movement)
            elif self.anomaly_progression < 0.7:
                data['gait_symmetry'] -= random.uniform(0.15, 0.25)
                data['activity_score'] -= random.uniform(15, 25)
                if data['activity_score'] > 30:  # Only when active
                    data['heart_rate'] += random.uniform(10, 20)

            # Day 11-14: Obvious symptoms (would be caught by owner visually)
            else:
                data['gait_symmetry'] -= random.uniform(0.25, 0.35)
                data['activity_score'] -= random.uniform(25, 35)
                data['heart_rate'] += random.uniform(15, 25)
                data['sleep_quality'] -= random.uniform(0.1, 0.2)

        return data

    def generate_datapoint(self) -> Dict:
        """Generate single telemetry snapshot"""
        # Base readings with natural variation
        data = {
            'pet_id': self.pet_id,
            'timestamp': datetime.utcnow().isoformat() + 'Z',
            'heart_rate': int(self.baseline_hr + random.uniform(-5, 5)),
            'activity_score': self.baseline_activity + random.uniform(-10, 10),
            'gait_symmetry': self.baseline_gait + random.uniform(-0.05, 0.02),
            'sleep_quality': self.baseline_sleep + random.uniform(-0.08, 0.05),
            'metadata': {
                'breed': self.breed,
                'age_years': self.age_years,
                'sensor_type': 'smartphone_cv',
                'confidence': round(random.uniform(0.88, 0.98), 2),
                'condition': self.condition or 'healthy'
            }
        }

        # Apply condition effects
        data = self._apply_condition_effects(data)

        # Clamp values to realistic ranges
        data['heart_rate'] = max(50, min(180, data['heart_rate']))
        data['activity_score'] = max(0, min(100, data['activity_score']))
        data['gait_symmetry'] = max(0.3, min(1.0, data['gait_symmetry']))
        data['sleep_quality'] = max(0.2, min(1.0, data['sleep_quality']))

        # Round for readability
        data['activity_score'] = round(data['activity_score'])
        data['gait_symmetry'] = round(data['gait_symmetry'], 2)
        data['sleep_quality'] = round(data['sleep_quality'], 2)

        return data

    def advance_time(self, hours: float = 0.033):
        """Advance simulation time (default: 2 seconds = 0.033 hours)"""
        self.days_elapsed += hours / 24.0


class ConfluentLiveProducer:
    """Production-grade Confluent Cloud producer with monitoring"""

    def __init__(self):
        self.topic = 'pet-health-stream'

        # Production configuration
        self.config = {
            'bootstrap.servers': os.getenv('CONFLUENT_BOOTSTRAP_SERVERS'),
            'security.protocol': 'SASL_SSL',
            'sasl.mechanisms': 'PLAIN',
            'sasl.username': os.getenv('CONFLUENT_API_KEY'),
            'sasl.password': os.getenv('CONFLUENT_API_SECRET'),

            # Performance tuning
            'linger.ms': 10,           # Batch messages for up to 10ms
            'batch.size': 32768,       # 32KB batches
            'compression.type': 'snappy',  # Fast compression
            'acks': 'all',             # Wait for all replicas
            'retries': 10,             # Retry failed sends
            'max.in.flight.requests.per.connection': 5
        }

        # Validate credentials
        if not all([self.config['bootstrap.servers'],
                   self.config['sasl.username'],
                   self.config['sasl.password']]):
            raise ValueError(
                "Missing Confluent credentials! Set:\n"
                "  CONFLUENT_BOOTSTRAP_SERVERS\n"
                "  CONFLUENT_API_KEY\n"
                "  CONFLUENT_API_SECRET"
            )

        self.producer = Producer(self.config)
        self.message_count = 0
        self.error_count = 0

    def delivery_callback(self, err, msg):
        """Callback for message delivery reports"""
        if err:
            self.error_count += 1
            print(f'❌ Delivery failed: {err}')
        else:
            self.message_count += 1
            if self.message_count % 10 == 0:  # Log every 10th message
                print(f'✅ {self.message_count} messages delivered | '
                      f'Latest: {msg.topic()}[{msg.partition()}] @ offset {msg.offset()}')

    def send_message(self, data: Dict):
        """Send message to Confluent Cloud"""
        try:
            self.producer.produce(
                topic=self.topic,
                key=data['pet_id'].encode('utf-8'),
                value=json.dumps(data).encode('utf-8'),
                callback=self.delivery_callback
            )
            # Trigger callbacks for delivered messages
            self.producer.poll(0)

        except BufferError:
            # Queue full - wait for some messages to be delivered
            print('⏳ Local queue full, waiting...')
            self.producer.flush()
            self.send_message(data)  # Retry

    def flush(self):
        """Ensure all messages are sent"""
        remaining = self.producer.flush(timeout=30)
        if remaining > 0:
            print(f'⚠️  {remaining} messages still pending after flush')


def run_live_stream(duration_hours: Optional[float] = None, interval_seconds: int = 2):
    """
    Run continuous pet health streaming

    Args:
        duration_hours: How long to run (None = infinite)
        interval_seconds: Seconds between data points (default: 2)
    """
    print("=" * 80)
    print("🐾 PetTwin Care - Live Confluent Cloud Producer")
    print("=" * 80)
    print(f"📡 Topic: pet-health-stream")
    print(f"⏱️  Interval: {interval_seconds}s per data point")
    print(f"⏰ Duration: {'CONTINUOUS (24/7)' if duration_hours is None else f'{duration_hours} hours'}")
    print()
    print("🐕 Streaming pets:")
    print("   1. MAX (Golden Retriever, 7y) - Healthy baseline")
    print("   2. LUNA (Chihuahua, 3y) - Healthy baseline")
    print("   3. CHARLIE (German Shepherd, 9y) - Developing arthritis")
    print("   4. BELLA (Beagle, 5y) - Healthy baseline")
    print()
    print("🎯 PURPOSE: Show judges LIVE DATA flowing through Confluent dashboard")
    print("=" * 80)
    print()

    # Initialize producer
    producer = ConfluentLiveProducer()

    # Initialize pets
    pets = [
        PetHealthSimulator('MAX_001', 'golden_retriever', 7, condition=None),
        PetHealthSimulator('LUNA_002', 'chihuahua', 3, condition=None),
        PetHealthSimulator('CHARLIE_003', 'german_shepherd', 9, condition='early_arthritis'),
        PetHealthSimulator('BELLA_004', 'beagle', 5, condition=None)
    ]

    # Start streaming
    start_time = time.time()
    iteration = 0

    try:
        while True:
            # Check duration limit
            if duration_hours and (time.time() - start_time) > duration_hours * 3600:
                break

            iteration += 1

            # Generate and send data for all pets
            for pet in pets:
                data = pet.generate_datapoint()
                producer.send_message(data)
                pet.advance_time(hours=interval_seconds / 3600.0)

            # Status update every 30 iterations (~1 minute)
            if iteration % 30 == 0:
                elapsed_hours = (time.time() - start_time) / 3600.0
                print(f"\n📊 STATUS UPDATE (after {elapsed_hours:.1f}h)")
                print(f"   ✅ Total messages: {producer.message_count}")
                print(f"   ❌ Errors: {producer.error_count}")
                print(f"   🐕 CHARLIE progression: Day {pets[2].days_elapsed:.1f}/14")
                print(f"      - Gait: {pets[2].baseline_gait - (0.3 * pets[2].anomaly_progression):.2f}")
                print(f"      - Activity: {pets[2].baseline_activity - (30 * pets[2].anomaly_progression):.0f}")
                print()

            # Wait for next iteration
            time.sleep(interval_seconds)

    except KeyboardInterrupt:
        print("\n\n⏹️  Stopping producer (Ctrl+C detected)...")

    finally:
        print("\n🔄 Flushing remaining messages...")
        producer.flush()
        print(f"\n✅ FINAL STATS:")
        print(f"   📨 Total messages sent: {producer.message_count}")
        print(f"   ❌ Errors: {producer.error_count}")
        print(f"   ⏱️  Runtime: {(time.time() - start_time) / 3600:.2f} hours")
        print("\n🎉 Producer shut down gracefully\n")


if __name__ == '__main__':
    import argparse

    parser = argparse.ArgumentParser(description='PetTwin Care - Live Confluent Cloud Producer')
    parser.add_argument('--duration', type=float, default=None,
                       help='Duration in hours (omit for continuous 24/7 streaming)')
    parser.add_argument('--interval', type=int, default=2,
                       help='Seconds between data points (default: 2)')

    args = parser.parse_args()

    run_live_stream(duration_hours=args.duration, interval_seconds=args.interval)
