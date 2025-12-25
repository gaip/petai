import time
import json
import threading
from data_simulator import DataSimulator
from datadog_logger import DatadogLogger

class MockKafkaProducer:
    def __init__(self, topic: str):
        self.topic = topic
        self.simulator = DataSimulator()
        self.dd = DatadogLogger()
        self.running = False
        self._buffer = [] # Shared buffer to simulate a broker

    def start_producing(self, pet_id: str, interval_sec: float = 2.0):
        """Starts a background thread to produce data."""
        self.running = True
        thread = threading.Thread(target=self._produce_loop, args=(pet_id, interval_sec))
        thread.daemon = True
        thread.start()

    def _produce_loop(self, pet_id: str, interval_sec: float):
        print(f"[Confluent Producer] Starting stream for {self.topic}...")
        while self.running:
            # Generate 1 data point (simulating real-time)
            # We treat the '30 days' generator as a source of single points for this demo
            df = self.simulator.generate_healthy_data(pet_id, days=1)
            record = df.iloc[0].to_dict()
            record['timestamp'] = record['timestamp'].isoformat()
            
            # Simulate Kafka serialization
            msg = json.dumps(record)
            
            # "Send" to broker (shared buffer for demo)
            # In real Kafka: producer.produce(self.topic, key=pet_id, value=msg)
            self._buffer.append(msg)
            
            # Log to Datadog
            self.dd.log_metric("kafka.messages_produced", 1, [f"topic:{self.topic}", f"pet_id:{pet_id}"])
            
            # Keep buffer size manageable for demo
            if len(self._buffer) > 100:
                self._buffer.pop(0)
                
            print(f"[Confluent Producer] Sent: {record['activity_score']} activity")
            time.sleep(interval_sec)

    def stop(self):
        self.running = False
