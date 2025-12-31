"""
Datadog APM (Application Performance Monitoring) Configuration
Enables distributed tracing for PetTwin Care
"""

import os
import logging

logger = logging.getLogger(__name__)

# Datadog APM Configuration
DD_APM_ENABLED = os.getenv('DD_APM_ENABLED', 'true').lower() == 'true'

def initialize_apm():
    """Initialize Datadog APM tracing"""

    if not DD_APM_ENABLED:
        logger.info("⚠️  Datadog APM disabled via DD_APM_ENABLED=false")
        return False

    try:
        from ddtrace import config, patch_all, tracer

        # Configure service name
        config.service = os.getenv('DD_SERVICE', 'pettwin-care')
        config.env = os.getenv('DD_ENV', 'production')
        config.version = os.getenv('DD_VERSION', '1.0.0')

        # Configure tracer
        tracer.configure(
            hostname=os.getenv('DD_AGENT_HOST', 'datadog-agent'),
            port=int(os.getenv('DD_TRACE_AGENT_PORT', '8126')),
        )

        # Auto-instrument libraries
        patch_all()

        # Configure specific integrations
        config.kafka.service = 'pettwin-kafka'
        config.requests.service = 'pettwin-external-api'

        # Tag all traces
        tracer.set_tags({
            'project': 'pettwin-care',
            'hackathon': 'google-cloud-ai',
            'stack': 'kafka-vertexai-nextjs'
        })

        logger.info("✅ Datadog APM initialized successfully")
        logger.info(f"   Service: {config.service}")
        logger.info(f"   Environment: {config.env}")
        logger.info(f"   Version: {config.version}")
        logger.info(f"   Agent: {tracer.hostname}:{tracer.port}")

        return True

    except ImportError:
        logger.warning("⚠️  ddtrace not installed. Install with: pip install ddtrace")
        logger.warning("   APM tracing disabled - metrics will still work")
        return False
    except Exception as e:
        logger.error(f"❌ Failed to initialize Datadog APM: {e}")
        return False


def trace_vertex_ai_call(func):
    """Decorator to trace Vertex AI API calls"""

    if not DD_APM_ENABLED:
        return func

    try:
        from ddtrace import tracer

        def wrapper(*args, **kwargs):
            with tracer.trace(
                "vertex.ai.inference",
                service="pettwin-vertex-ai",
                resource="gemini-pro",
                span_type="ai"
            ) as span:
                # Add custom tags
                span.set_tag("ai.model", "gemini-pro")
                span.set_tag("ai.provider", "google-vertex-ai")

                # Extract pet_id if available
                if args and len(args) > 0 and isinstance(args[0], dict):
                    pet_id = args[0].get('pet_id', 'unknown')
                    span.set_tag("pet.id", pet_id)

                try:
                    result = func(*args, **kwargs)
                    span.set_tag("ai.status", "success")
                    return result
                except Exception as e:
                    span.set_tag("ai.status", "error")
                    span.set_tag("error.message", str(e))
                    raise

        return wrapper

    except ImportError:
        return func


def trace_kafka_operation(operation_name):
    """Decorator to trace Kafka operations"""

    def decorator(func):
        if not DD_APM_ENABLED:
            return func

        try:
            from ddtrace import tracer

            def wrapper(*args, **kwargs):
                with tracer.trace(
                    f"kafka.{operation_name}",
                    service="pettwin-kafka",
                    resource="pet-health-stream",
                    span_type="queue"
                ) as span:
                    span.set_tag("messaging.system", "kafka")
                    span.set_tag("messaging.destination", "pet-health-stream")
                    span.set_tag("messaging.operation", operation_name)

                    return func(*args, **kwargs)

            return wrapper
        except ImportError:
            return func

    return decorator


# AI Observability - LLM Monitoring
def initialize_llm_observability():
    """Initialize Datadog LLM Observability for Vertex AI/Gemini"""

    try:
        from ddtrace.llmobs import LLMObs

        # Enable LLM Observability
        LLMObs.enable(
            ml_app="pettwin-care-ai",
            api_key=os.getenv('DD_API_KEY'),
            site=os.getenv('DD_SITE', 'datadoghq.eu'),
            agentless_enabled=False,  # Use agent
            env=os.getenv('DD_ENV', 'production'),
        )

        logger.info("✅ Datadog LLM Observability initialized")
        return True

    except ImportError:
        logger.warning("⚠️  LLM Observability requires ddtrace>=2.0.0")
        return False
    except Exception as e:
        logger.error(f"❌ Failed to initialize LLM Observability: {e}")
        return False


def annotate_llm_call(prompt, response, model="gemini-pro"):
    """Annotate LLM calls for AI Observability"""

    try:
        from ddtrace.llmobs import LLMObs
        from ddtrace.llmobs.decorators import llm

        # Track LLM metrics
        LLMObs.annotate(
            span=None,  # Current span
            input_data=prompt,
            output_data=response,
            metadata={
                "model": model,
                "provider": "google-vertex-ai",
                "temperature": 0.7,
                "use_case": "pet-health-diagnostics"
            },
            metrics={
                "input_tokens": len(prompt.split()),
                "output_tokens": len(response.split()) if response else 0,
            },
            tags={
                "ml.application": "pettwin-care",
                "ml.task": "health-anomaly-explanation"
            }
        )

    except Exception as e:
        logger.debug(f"Could not annotate LLM call: {e}")


# Export for easy import
__all__ = [
    'initialize_apm',
    'initialize_llm_observability',
    'trace_vertex_ai_call',
    'trace_kafka_operation',
    'annotate_llm_call',
    'DD_APM_ENABLED'
]
