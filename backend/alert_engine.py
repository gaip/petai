import random

class AlertEngine:
    def __init__(self):
        pass

    def generate_alert(self, pet_name: str, metric: str, severity: str) -> str:
        """
        Simulates Vertex AI text generation.
        """
        templates = [
            f"{pet_name}'s {metric} levels have moved outside normal parameters ({severity} severity).",
            f"We detected a {severity} anomaly in {pet_name}'s {metric} patterns. This looks unusual.",
            f"Insight: {pet_name} is showing signs of changed {metric} behavior. Recommended to monitor closely."
        ]
        return random.choice(templates)

    def generate_audio(self, text: str) -> str:
        """
        Simulates ElevenLabs API.
        Returns a dummy URL or base64 string.
        """
        # In a real app: client.generate(text=text, voice="Bella")
        print(f"[ElevenLabs] Generating audio for: '{text}'")
        return "/mock_audio.mp3"
