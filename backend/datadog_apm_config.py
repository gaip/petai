import os
import logging
from ddtrace import tracer, patch_all
from ddtrace.llmobs import LLMObs

# Configure Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("datadog_apm")

def configure_datadog():
    """
    Configures Datadog APM and AI Observability (LLM Monitoring).
    Run this at the start of the application.
    """
    try:
        # Patch all supported libraries (Flask, Kafka, Requests, etc.)
        patch_all()
        logger.info("✅ Datadog APM initialized successfully: patch_all() complete")

        # Configure LLM Observability for Gemini (Vertex AI)
        # Note: Datadog's LLM Observability usually requires setting DD_LLMOBS_ENABLED=1 in env
        # and using the SDK to trace specific calls if auto-instrumentation isn't enough.
        
        # Manually initialize LLMObs just in case
        LLMObs.enable()
        logger.info("✅ Datadog LLM Observability initialized: LLMObs.enable() complete")

    except Exception as e:
        logger.error(f"❌ Failed to initialize Datadog APM: {e}")

def trace_vertex_ai_call(func):
    """
    Decorator to wrap Vertex AI calls with a Datadog span.
    Captures prompt (input) and response (output) if possible.
    """
    def wrapper(*args, **kwargs):
        with tracer.trace("vertex.ai.generate_content", service="pettwin-backend-ai", resource="gemini-pro") as span:
            span.set_tag("component", "generative_ai")
            span.set_tag("ai.model", "gemini-pro")
            
            # Log input prompt if available (assuming arg[0] or 'prompt' kwarg)
            prompt = kwargs.get('prompt') or (args[0] if args else "unknown")
            span.set_tag("ai.prompt", str(prompt)[:500]) # truncated for safety

            try:
                result = func(*args, **kwargs)
                
                # Try to capture response text
                if hasattr(result, 'text'):
                    response_text = result.text
                else:
                    response_text = str(result)
                
                span.set_tag("ai.response", response_text[:500])
                
                # Annotate LLMObs event
                LLMObs.annotate(
                    span=span,
                    input_data=str(prompt),
                    output_data=response_text,
                    model_name="gemini-pro",
                    web_app_name="pettwin-care-ai"
                )
                
                return result
            except Exception as e:
                span.set_tag("error.message", str(e))
                span.set_tag("error.type", type(e).__name__)
                raise e
    return wrapper
