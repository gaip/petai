import unittest
from unittest.mock import patch, MagicMock, call
import os
import json
import sys

# --- Pre-mock vertexai library ---
MOCK_VERTEXAI = MagicMock()
sys.modules['vertexai'] = MOCK_VERTEXAI
sys.modules['vertexai.generative_models'] = MOCK_VERTEXAI.generative_models
# --- End Pre-mock ---

os.environ["GCP_PROJECT_ID"] = "test-project"

from backend.ai_engine import AIEngine
from backend.confluent_consumer_ai import AnomalyDetector

# Mock data for testing
SAMPLE_ANOMALY_DATA = {
    "pet_id": "test_pet_123",
    "anomalies": ["heart_rate (z=3.1)"],
    "max_severity_z": 3.1,
    "metrics": {"heart_rate": 150, "activity_score": 50, "gait_symmetry": 0.9},
}

SUCCESSFUL_AI_RESPONSE = {
    "alert_title": "High Heart Rate Detected",
    "severity_level": "HIGH",
    "medical_explanation": "The pet's heart rate is significantly elevated.",
    "recommended_action": "Monitor the pet and consult a vet if it persists.",
    "confidence_score": 0.95,
}

GENERATIVE_MODEL_PATCH_TARGET = 'backend.ai_engine.GenerativeModel'

class TestAIEngine(unittest.TestCase):

    def setUp(self):
        """Reset the mock before each test."""
        MOCK_VERTEXAI.reset_mock()

    @patch(GENERATIVE_MODEL_PATCH_TARGET)
    def test_initialization_successful(self, mock_generative_model):
        """Test that the AIEngine initializes correctly with a valid model."""
        mock_generative_model.return_value = MagicMock()

        engine = AIEngine(project_id="test-project", location="us-central1")

        MOCK_VERTEXAI.init.assert_called_once_with(project="test-project", location="us-central1")
        self.assertTrue(engine.gemini_enabled)
        self.assertIsNotNone(engine.model)

    @patch(GENERATIVE_MODEL_PATCH_TARGET, side_effect=Exception("Initialization failed"))
    def test_initialization_failure(self, mock_generative_model):
        """Test that the AIEngine handles failures during model initialization."""
        engine = AIEngine(project_id="test-project", location="us-central1")

        self.assertFalse(engine.gemini_enabled)
        self.assertIsNone(engine.model)

    @patch(GENERATIVE_MODEL_PATCH_TARGET)
    def test_analyze_anomaly_successful_first_try(self, mock_generative_model):
        """Test a successful analysis call on the first attempt."""
        mock_model_instance = MagicMock()
        mock_response = MagicMock()
        mock_response.text = json.dumps(SUCCESSFUL_AI_RESPONSE)
        mock_model_instance.generate_content.return_value = mock_response
        mock_generative_model.return_value = mock_model_instance

        engine = AIEngine(project_id="test-project", location="us-central1")
        result = engine.analyze_anomaly(SAMPLE_ANOMALY_DATA)

        mock_model_instance.generate_content.assert_called_once()
        self.assertEqual(result, SUCCESSFUL_AI_RESPONSE)

    @patch('time.sleep', return_value=None)
    @patch(GENERATIVE_MODEL_PATCH_TARGET)
    def test_retry_mechanism_on_failure(self, mock_generative_model, mock_sleep):
        """Test that the retry mechanism works correctly."""
        mock_model_instance = MagicMock()
        mock_response = MagicMock()
        mock_response.text = json.dumps(SUCCESSFUL_AI_RESPONSE)

        mock_model_instance.generate_content.side_effect = [Exception("API Error 1"), Exception("API Error 2"), mock_response]
        mock_generative_model.return_value = mock_model_instance

        engine = AIEngine(project_id="test-project", location="us-central1", max_retries=3)
        result = engine.analyze_anomaly(SAMPLE_ANOMALY_DATA)

        self.assertEqual(mock_model_instance.generate_content.call_count, 3)
        self.assertEqual(result, SUCCESSFUL_AI_RESPONSE)
        mock_sleep.assert_has_calls([call(1), call(2)])

    @patch('time.sleep', return_value=None)
    @patch(GENERATIVE_MODEL_PATCH_TARGET)
    def test_fallback_after_max_retries(self, mock_generative_model, mock_sleep):
        """Test that the fallback analysis is used after all retries fail."""
        mock_model_instance = MagicMock()
        mock_model_instance.generate_content.side_effect = Exception("Persistent API Error")
        mock_generative_model.return_value = mock_model_instance

        engine = AIEngine(project_id="test-project", location="us-central1", max_retries=3)
        result = engine.analyze_anomaly(SAMPLE_ANOMALY_DATA)

        self.assertEqual(mock_model_instance.generate_content.call_count, 3)
        self.assertEqual(result['alert_title'], "Anomaly Detected: heart_rate (z=3.1)")

class TestAnomalyDetector(unittest.TestCase):

    def setUp(self):
        """Set up a mock AIEngine for the AnomalyDetector."""
        self.mock_ai_engine = MagicMock(spec=AIEngine)
        self.detector = AnomalyDetector(ai_engine=self.mock_ai_engine, window_size=20, z_threshold=3.0)

    def test_analyze_no_anomaly(self):
        """Test that no analysis is triggered when data is within normal range."""
        for i in range(10):
            self.detector.analyze({"heart_rate": 80 + i, "activity_score": 60, "gait_symmetry": 1.0})

        result = self.detector.analyze({"heart_rate": 85, "activity_score": 60, "gait_symmetry": 1.0})

        self.assertIsNone(result)
        self.mock_ai_engine.analyze_anomaly.assert_not_called()

    def test_analyze_insufficient_data(self):
        """Test that no analysis is done when there is not enough historical data."""
        result = self.detector.analyze({"heart_rate": 150})
        self.assertIsNone(result)

    def test_analyze_with_anomaly(self):
        """Test that the AIEngine is called when a statistical anomaly is detected."""
        # Create a stable baseline with some variance
        for i in range(10):
            self.detector.analyze({"heart_rate": 80 + (i % 3 - 1), "activity_score": 60, "gait_symmetry": 1.0})

        self.mock_ai_engine.analyze_anomaly.return_value = SUCCESSFUL_AI_RESPONSE

        # Introduce a clear anomaly
        result = self.detector.analyze({"heart_rate": 200, "activity_score": 60, "gait_symmetry": 1.0})

        self.assertIsNotNone(result)
        self.mock_ai_engine.analyze_anomaly.assert_called_once()
        self.assertIn("ai_analysis", result)
        self.assertEqual(result['ai_analysis'], SUCCESSFUL_AI_RESPONSE)
        self.assertGreater(abs(result['z_scores']['heart_rate']), 3.0)

if __name__ == '__main__':
    unittest.main(verbosity=2)
