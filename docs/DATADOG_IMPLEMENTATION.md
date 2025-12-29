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
