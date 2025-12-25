import json
import time
import threading
from datadog_logger import DatadogLogger
from anomaly_detection import AnomalyDetector
from alert_engine import AlertEngine
import pandas as pd

class MockKafkaConsumer:
    def __init__(self, producer_ref, topic: str):
        self.producer = producer_ref # direct reference for mock
        self.topic = topic
        self.running = False
        self.dd = DatadogLogger()
        self.detector = AnomalyDetector()
        self.alert_engine = AlertEngine()
        
        # Pre-train detector for demo
        # (In reality, models are loaded from storage)
        print("[Consumer] Pre-training isolation forest...")
        from data_simulator import DataSimulator
        sim = DataSimulator()
        self.detector.train(sim.generate_healthy_data("demo"))

    def start_consuming(self, callback):
        """Starts consuming. callback(processed_result) is called on anomaly."""
        self.running = True
        thread = threading.Thread(target=self._consume_loop, args=(callback,))
        thread.daemon = True
        thread.start()

    def _consume_loop(self, callback):
        print(f"[Confluent Consumer] Listening on {self.topic}...")
        while self.running:
            if self.producer._buffer:
                # "Poll" message
                msg = self.producer._buffer.pop(0)
                data = json.loads(msg)
                
                # Transform to DataFrame for model
                df = pd.DataFrame([data])
                # We need columns for prediction
                # activity_score, sleep_hours, heart_rate
                
                # Detect
                try:
                    results = self.detector.detect(df)
                    score = self.detector.get_health_score(results.iloc[0]['anomaly_score'])
                    
                    self.dd.log_metric("pet.health_score", score, [f"pet_id:{data['pet_id']}"])
                    
                    if score < 8:
                        # Generate Multimodal Alert
                        severity = "high" if score < 5 else "medium"
                        text_alert = self.alert_engine.generate_alert(data['pet_id'], "vitals", severity)
                        audio_url = self.alert_engine.generate_audio(text_alert)
                        
                        event = {
                            "timestamp": data['timestamp'],
                            "pet_id": data['pet_id'],
                            "score": score,
                            "alert": {
                                "text": text_alert,
                                "audio_url": audio_url,
                                "severity": severity
                            }
                        }
                        
                        self.dd.log_event("Anomaly Alert Sent", text_alert, "warn")
                        callback(event)
                        
                except Exception as e:
                    print(f"Consumer Error: {e}")
                
            time.sleep(1) # Poll interval

    def stop(self):
        self.running = False
