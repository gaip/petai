# Datadog Screenshots Guide

This document describes the screenshots needed for the hackathon submission to demonstrate Datadog observability implementation.

## Required Screenshots

### 1. Dashboard Overview
**File**: `docs/screenshots/datadog-dashboard.png`
**URL**: https://app.datadoghq.eu/dashboard/t7g-ubd-aet

**What to capture:**
- Full dashboard view showing both widgets
- Vertex AI Inference Latency timeseries graph
- Anomaly Detection Accuracy query value
- Time range selector showing "Live" mode
- Dashboard title: "PetTwin Care - AI Health Monitoring & LLM Observability"

**Instructions:**
1. Navigate to the dashboard URL
2. Ensure widgets are displaying data (or showing "no data" state)
3. Take a full-width screenshot
4. Save as `docs/screenshots/datadog-dashboard.png`

---

### 2. Monitor Configuration
**File**: `docs/screenshots/datadog-monitor.png`
**URL**: https://app.datadoghq.eu/monitors/96636457

**What to capture:**
- Monitor name: "PetTwin Care - Vertex AI Gemini Latency Anomaly Detection"
- Monitor type: Anomaly
- Metric being monitored: `vertex.ai.inference.latency`
- Alert conditions (100% out of bounds for 15 minutes)
- Alert message with custom text
- Status history (if available)

**Instructions:**
1. Navigate to the monitor URL
2. Scroll to show the full monitor configuration
3. Capture the key settings:
   - Detection method
   - Alert conditions
   - Alert message
   - Notification settings
4. Save as `docs/screenshots/datadog-monitor.png`

---

### 3. Monitor Status & Events
**File**: `docs/screenshots/datadog-monitor-status.png`
**URL**: https://app.datadoghq.eu/monitors/96636457

**What to capture:**
- Current monitor status (OK, Alert, No Data, etc.)
- Event timeline (if any alerts have been triggered)
- Evaluation graph showing the monitored metric
- Anomaly detection visualization (baseline + actual values)

**Instructions:**
1. On the same monitor page, scroll to the "Status & History" section
2. Capture the status overview and event timeline
3. Include the evaluation graph if visible
4. Save as `docs/screenshots/datadog-monitor-status.png`

---

### 4. Alert Notification Example
**File**: `docs/screenshots/datadog-alert-notification.png`

**What to capture:**
- Example alert notification (if an alert has been triggered)
- Or: The alert message preview from monitor settings
- Shows the custom alert message with:
  - Alert title
  - Diagnostic information
  - Remediation steps
  - Dashboard link
  - Escalation information

**Instructions:**
**Option A (if alert has been triggered):**
1. Check your email or notification channels for a Datadog alert
2. Capture the full alert message
3. Save as screenshot

**Option B (preview from settings):**
1. In the monitor configuration, find the "Say what's happening" section
2. Click "Preview" to see how the alert will look
3. Capture the preview
4. Save as `docs/screenshots/datadog-alert-notification.png`

---

### 5. Dashboard Widgets Detail
**File**: `docs/screenshots/datadog-widget-detail.png`

**What to capture:**
- Click on the Vertex AI Inference Latency widget to expand it
- Show the full timeseries graph with anomaly bands
- Include legend showing metric details
- Show time range and any anomalies detected

**Instructions:**
1. On the dashboard, click the Vertex AI Inference Latency widget
2. The widget should expand to full screen
3. Capture the detailed view
4. Save as `docs/screenshots/datadog-widget-detail.png`

---

## Optional Screenshots (Bonus Points)

### 6. Incident Timeline
**File**: `docs/screenshots/datadog-incident.png`

If you've created an incident from an alert:
- Show the incident timeline
- Incident severity and status
- Responders and actions taken
- Resolution notes

### 7. Log Integration
**File**: `docs/screenshots/datadog-logs.png`

If you've integrated logs:
- Show Vertex AI or backend service logs in Datadog
- Demonstrate log correlation with metrics
- Show log patterns or analytics

### 8. APM Traces
**File**: `docs/screenshots/datadog-apm.png`

If you've instrumented the application with APM:
- Show service map
- Request traces through Vertex AI
- Performance metrics

---

## Screenshot Organization

Create the following directory structure:

```
docs/
└── screenshots/
    ├── datadog-dashboard.png          (Required)
    ├── datadog-monitor.png            (Required)
    ├── datadog-monitor-status.png     (Required)
    ├── datadog-alert-notification.png (Required)
    ├── datadog-widget-detail.png      (Optional)
    ├── datadog-incident.png           (Optional)
    ├── datadog-logs.png               (Optional)
    └── datadog-apm.png                (Optional)
```

---

## Adding Screenshots to Documentation

Once you have the screenshots, update these files:

### 1. Update DATADOG_IMPLEMENTATION.md
Replace the placeholder lines with actual screenshots:

```markdown
### Dashboard Screenshot
![Datadog Dashboard](../docs/screenshots/datadog-dashboard.png)
*Real-time monitoring of Vertex AI inference and pet health metrics*
```

### 2. Update README.md
Add a screenshots section in the Datadog Observability section:

```markdown
**Screenshots:**
- [Dashboard Overview](docs/screenshots/datadog-dashboard.png)
- [Monitor Configuration](docs/screenshots/datadog-monitor.png)
- [Alert Example](docs/screenshots/datadog-alert-notification.png)
```

### 3. Include in Devpost Submission
Upload screenshots to your Devpost project submission to visually demonstrate:
- Comprehensive monitoring dashboard
- Anomaly detection rules
- Incident management workflow

---

## Tips for Best Screenshots

1. **Resolution**: Use at least 1920x1080 resolution
2. **Clarity**: Ensure text is readable
3. **Context**: Include enough context (titles, labels, legends)
4. **Annotations**: Optionally add arrows or highlights to key features
5. **File Format**: Use PNG for best quality
6. **File Size**: Compress if needed (keep under 2MB per image)

---

## Screenshot Verification Checklist

Before submitting, verify:

- [ ] All required screenshots are captured
- [ ] Screenshots are clear and readable
- [ ] File names match the guide exactly
- [ ] Screenshots are saved in `docs/screenshots/` directory
- [ ] Screenshots are referenced in documentation
- [ ] Screenshots are committed to Git
- [ ] Screenshots are uploaded to Devpost

---

*This guide ensures comprehensive visual evidence of Datadog observability implementation for hackathon judges.*
