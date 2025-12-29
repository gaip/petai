# Datadog Observability Implementation

## Overview

PetTwin Care uses Datadog for end-to-end observability of our AI-powered pet health monitoring system.

## Dashboard

**Name:** PetTwin Care - AI Health Monitoring & LLM Observability  
**URL:** https://app.datadoghq.eu/dashboard/t7g-ubd-aet

### Monitored Metrics

1. **Vertex AI Gemini Inference Latency** - Tracks AI model response times with anomaly detection
2. **Anomaly Detection Accuracy** - Monitors the effectiveness of our pet health anomaly detection

## Detection Rules

**Monitor:** PetTwin Care - Vertex AI Gemini Latency Anomaly Detection  
**Type:** Anomaly Detection  
**URL:** https://app.datadoghq.eu/monitors/96636457

### Alert Logic

- Triggers when AI inference latency deviates significantly from historical patterns
- Evaluates 15-minute windows
- Alerts sent with full context and remediation steps

## Incident Response Workflow

1. Anomaly detected → Monitor triggers
2. Alert sent with diagnostic information
3. Engineer investigates dashboard
4. Incident created if needed
5. Resolution tracked through Datadog Events

## Advanced Code Integration (APM)

We have enabled **Datadog Source Code Integration** to link runtime telemetry directly to GitHub source code.

- **Mechanism**: Dynamic injection of `DD_GIT_COMMIT_SHA` and `DD_GIT_REPOSITORY_URL` during Cloud Run deployment.
- **Benefit**: Debugging stack traces in Datadog instantly links to the exact line of code in this repository.
- **Implementation**: See `deploy_to_cloud_run.sh`

## Infrastructure as Code

The entire monitoring dashboard is defined in JSON for reproducibility:

- **File**: `docs/datadog_dashboard_config.json`
- **Usage**: Can be imported directly into Datadog to recreate the "PetTwin Production" view.
