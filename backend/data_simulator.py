import pandas as pd
import numpy as np
from datetime import datetime, timedelta

class DataSimulator:
    def __init__(self, seed=42):
        np.random.seed(seed)

    def generate_healthy_data(self, pet_id: str, days: int = 30) -> pd.DataFrame:
        """Generates baseline healthy data."""
        # Baseline activity: Normal distribution centered at 80
        dates = [datetime.now() - timedelta(days=x) for x in range(days)]
        dates.reverse()
        
        data = []
        for date in dates:
            activity = np.random.normal(80, 5) # Mean 80, SD 5
            sleep = np.random.normal(12, 1)    # Mean 12h, SD 1
            heart_rate = np.random.normal(80, 5) # Mean 80, SD 5
            
            data.append({
                "timestamp": date,
                "pet_id": pet_id,
                "activity_score": max(0, min(100, activity)),
                "sleep_hours": max(0, sleep),
                "heart_rate": heart_rate,
                "status": "healthy"
            })
            
        return pd.DataFrame(data)

    def generate_declining_data(self, pet_id: str, days: int = 7) -> pd.DataFrame:
        """Generates recent data showing health decline."""
        dates = [datetime.now() - timedelta(days=x) for x in range(days)]
        dates.reverse() # Oldest to newest
        
        data = []
        for i, date in enumerate(dates):
            # Progressive decline in activity
            decline_factor = i * 2 # Drops by 2 points each day
            activity = np.random.normal(80 - decline_factor, 5)
            
            # Sleep increases (lethargy)
            sleep = np.random.normal(12 + (i * 0.5), 1)
            
            data.append({
                "timestamp": date,
                "pet_id": pet_id,
                "activity_score": max(0, min(100, activity)),
                "sleep_hours": max(0, sleep),
                "heart_rate": np.random.normal(80, 5),
                "status": "declining"
            })
            
        return pd.DataFrame(data)

if __name__ == "__main__":
    sim = DataSimulator()
    df_healthy = sim.generate_healthy_data("max_01", 30)
    print(f"Generated {len(df_healthy)} healthy records.")
    print(df_healthy.head())
