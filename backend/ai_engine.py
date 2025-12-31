import os
import json
import logging
import time
from typing import Dict, Any

# Configure logger for this module
logger = logging.getLogger("PetTwinAI." + __name__)

# Datadog APM Integration (optional, for compatibility)
try:
    from datadog_apm_config import trace_vertex_ai_call
except ImportError:
    def trace_vertex_ai_call(func): return func

# Attempt to import Google Cloud libraries
try:
    import vertexai
    from vertexai.generative_models import GenerativeModel, GenerationConfig
    GEMINI_AVAILABLE = True
except ImportError:
    logger.warning("⚠️ google-cloud-aiplatform library not found. AIEngine will run in fallback mode.")
    GEMINI_AVAILABLE = False
except Exception as e:
    logger.error(f"❌ Failed to initialize Vertex AI libraries: {e}")
    GEMINI_AVAILABLE = False


class AIEngine:
    """
    Encapsulates all interactions with Google's Vertex AI for anomaly analysis.
    """

    SYSTEM_INSTRUCTION = """You are the PetTwin Virtual Veterinarian Agent (powered by Vertex AI).

    Your Goal: specific, actionable, and empathetic veterinary analysis.

    AGENT REASONING PROTOCOL:
    1. OBSERVE: Analyze the Z-Scores and metrics.
    2. REASON: Determine the likely physiological cause (e.g., pain, stress, infection).
    3. ACT: Generate a structured JSON alert.

    Your output MUST be a valid JSON object with the following schema:
    {
        "alert_title": "Short, urgent title (e.g., 'High Heart Rate Detected')",
        "severity_level": "LOW|MEDIUM|HIGH|CRITICAL",
        "medical_explanation": "Simple, non-jargon explanation for the owner (1 sentence)",
        "recommended_action": "Clear, actionable advice (e.g., 'Contact your vet today')",
        "confidence_score": 0.0-1.0
    }
    ALWAYS return PURE JSON. Do not use markdown blocks."""

    POSSIBLE_MODELS = [
        "gemini-1.5-pro-002",
        "gemini-1.5-flash-002",
        "gemini-pro"
    ]

    def __init__(self, project_id: str, location: str, max_retries: int = 3):
        self.model = None
        self.model_name = "N/A"
        self.gemini_enabled = False
        self.max_retries = max_retries

        if not GEMINI_AVAILABLE:
            logger.error("AIEngine cannot start because Vertex AI libraries are missing.")
            return

        try:
            vertexai.init(project=project_id, location=location)

            self.generation_config = GenerationConfig(
                temperature=0.3,
                top_p=0.95,
                response_mime_type="application/json",
                max_output_tokens=2048,
            )

            for m_name in self.POSSIBLE_MODELS:
                try:
                    temp_model = GenerativeModel(
                        model_name=m_name,
                        system_instruction=self.SYSTEM_INSTRUCTION
                    )
                    self.model = temp_model
                    self.model_name = m_name
                    self.gemini_enabled = True
                    logger.info(f"✅ AIEngine initialized with model: {self.model_name}")
                    break
                except Exception:
                    logger.warning(f"Could not initialize model {m_name}, trying next.")
                    continue

            if not self.gemini_enabled:
                 raise RuntimeError("Failed to initialize any of the possible Gemini models.")

        except Exception as e:
            logger.error(f"❌ AIEngine initialization failed: {e}")
            self.gemini_enabled = False

    @trace_vertex_ai_call
    def analyze_anomaly(self, analysis_result: Dict[str, Any]) -> Dict[str, Any]:
        """
        Sends anomaly data to Vertex AI Gemini for interpretation with a retry mechanism.
        """
        if not self.gemini_enabled:
            return self._fallback_analysis(analysis_result)

        prompt = self._build_prompt(analysis_result)

        for attempt in range(self.max_retries):
            try:
                start_time = time.time()
                response = self.model.generate_content(
                    prompt,
                    generation_config=self.generation_config
                )
                latency = (time.time() - start_time) * 1000

                ai_response = json.loads(response.text)
                logger.info(f"🧠 Vertex AI Agent ({self.model_name}) reasoned in {latency:.0f}ms")

                return ai_response

            except Exception as e:
                logger.warning(f"⚠️ Vertex AI API call failed (Attempt {attempt + 1}/{self.max_retries}): {e}")
                if attempt + 1 == self.max_retries:
                    logger.error("❌ Max retries reached. Using fallback analysis.")
                    return self._fallback_analysis(analysis_result)

                # Exponential backoff
                time.sleep(2 ** attempt)

        # This line should not be reached, but as a safeguard:
        return self._fallback_analysis(analysis_result)

    def _build_prompt(self, result: Dict[str, Any]) -> str:
        """Constructs the detailed prompt for the Gemini model."""
        return f"""
        Analyze this anomaly event for Pet {result['pet_id']}:

        [OBSERVATION]
        - Anomalies: {result['anomalies']}
        - Severity (Z-Score): {result['max_severity_z']:.2f}
        - Current Metrics: {json.dumps(result['metrics'])}

        [CONTEXT]
        - Heart Rate baseline is typically around 80-120bpm for a healthy dog.
        - Activity is a score from 0 (no movement) to 100 (high-energy play).
        - Gait Symmetry of 1.0 is perfect. Values below 0.8 may indicate a limp.

        [TASK]
        Apply veterinary reasoning to determine the urgency and cause based on the observations.
        Return your analysis in the required JSON format.
        """

    def _fallback_analysis(self, result: Dict[str, Any]) -> Dict[str, Any]:
        """Generates a simple, static analysis when the AI model fails."""
        anomaly_str = ', '.join(result.get('anomalies', ['Unknown']))
        return {
            "alert_title": f"Anomaly Detected: {anomaly_str}",
            "severity_level": "MEDIUM",
            "medical_explanation": "A statistical deviation was detected in your pet's vitals.",
            "recommended_action": "Please monitor your pet closely and check their recent activity.",
            "confidence_score": 1.0
        }
