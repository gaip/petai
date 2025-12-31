from sklearn.ensemble import IsolationForest
import pandas as pd
import numpy as np

class AnomalyDetector:
    def __init__(self):
        self.model = IsolationForest(contamination=0.1, random_state=42)
        self.is_trained = False

    def train(self, historical_data: pd.DataFrame):
        """Trains the model on 'normal' historical data."""
        features = historical_data[['activity_score', 'sleep_hours', 'heart_rate']]
        self.model.fit(features)
        self.is_trained = True

    def detect(self, new_data: pd.DataFrame) -> pd.DataFrame:
        """
        Detects anomalies in new data.
        Returns DataFrame with 'anomaly' column (-1 for anomaly, 1 for normal)
        and 'anomaly_score'.
        """
        if not self.is_trained:
            raise Exception("Model not trained")
            
        features = new_data[['activity_score', 'sleep_hours', 'heart_rate']]
        predictions = self.model.predict(features)
        scores = self.model.decision_function(features)
        
        results = new_data.copy()
        results['anomaly_prediction'] = predictions
        results['anomaly_score'] = scores
        
        return results

    def get_health_score(self, anomaly_score):
        """Converts anomaly score to 0-10 health score."""
        # Simple mapping for demo: higher anomaly score (closer to 0 or positive) is better
        # Typical scores: Normal > 0, Abnormal < 0 (down to -0.5ish)
        # Map -0.5 to 1.0 range to 0-10
        norm_score = max(0, min(10, (anomaly_score + 0.5) * 10))
        return round(norm_score, 1)

if __name__ == "__main__":
    from data_simulator import DataSimulator
    
    sim = DataSimulator()
    detector = AnomalyDetector()
    
    # Train
    print("Training on healthy data...")
    healthy_df = sim.generate_healthy_data("max_01", 30)
    detector.train(healthy_df)
    
    # Test
    print("Testing on declining data...")
    declining_df = sim.generate_declining_data("max_01", 7)
    results = detector.detect(declining_df)
    
    print(results[['timestamp', 'activity_score', 'anomaly_prediction', 'anomaly_score']])
