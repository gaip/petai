import time
import random

class DatadogLogger:
    def __init__(self, service_name="pettwin-backend"):
        self.service = service_name
        self.enabled = True

    def log_metric(self, metric_name: str, value: float, tags: list = None):
        """Simulates sending a metric to Datadog."""
        if not self.enabled:
            return
            
        timestamp = int(time.time())
        tag_str = ",".join(tags) if tags else ""
        # In a real app, this would be a statsd call or HTTP request
        print(f"[Datadog] {self.service}.{metric_name}:{value}|g|#{tag_str}")

    def log_event(self, title: str, text: str, alert_type: str = "info"):
        """Simulates sending an event to Datadog."""
        print(f"[Datadog Event] [{alert_type.upper()}] {title}: {text}")

if __name__ == "__main__":
    dd = DatadogLogger()
    dd.log_metric("pet.heart_rate", 80, ["pet_id:max"])
    dd.log_event("Anomaly Detected", "Max's activity is low", "error")
