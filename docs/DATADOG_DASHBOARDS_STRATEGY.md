# Datadog Dashboards Strategy - PetTwin Care Hackathon Winning Package

## Objective

Create comprehensive, meaningful dashboards across ALL Datadog sections to demonstrate enterprise-grade observability and maximize hackathon impact.

## Dashboard Architecture

### 1. **APM (Application Performance Monitoring)**

**Dashboard Name:** "PetTwin - AI Pipeline Performance"

**Widgets:**

- Service Map: Kafka → Backend → Vertex AI → Firestore
- Trace Analytics: P50/P95/P99 latency for AI inference
- Error Rate: Failed Gemini API calls
- Throughput: Requests per second
- Top Endpoints: Most called services
- Span Analysis: Time spent in each component (Kafka consume, Z-score calc, Gemini call, DB write)

**Key Metrics:**

- `trace.flask.request.duration` (if using Flask)
- `trace.vertex_ai.generate_content.duration`
- `trace.kafka.consume.duration`
- Error rate by service

**Business Value:** Shows end-to-end latency from pet sensor → owner alert

---

### 2. **Infrastructure**

**Dashboard Name:** "PetTwin - Cloud Run Infrastructure Health"

**Widgets:**

- Container CPU Usage: `docker.cpu.usage`
- Container Memory: `docker.mem.rss`
- Container Count: Active instances
- Network I/O: `docker.net.bytes_sent/rcvd`
- Disk I/O: If applicable
- Instance Health: Uptime/restarts

**Key Metrics:**

- `system.cpu.idle`
- `system.mem.used`
- `docker.containers.running`
- `gcp.run.request.count`

**Business Value:** Proves production-ready deployment on Google Cloud

---

### 3. **Logs**

**Dashboard Name:** "PetTwin - AI Decision Audit Trail"

**Widgets:**

- Log Stream: Real-time anomaly detections
- Error Logs: Failed AI calls
- Log Patterns: Most common alert types
- Severity Distribution: INFO/WARN/ERROR breakdown
- Top Pets: Most frequently flagged pets
- Alert Timeline: When anomalies were detected

**Key Queries:**

- `service:pettwin-backend status:error`
- `service:pettwin-backend @alert_type:*`
- `service:pettwin-backend @severity:CRITICAL`

**Business Value:** Full audit trail for medical compliance

---

### 4. **Metrics**

**Dashboard Name:** "PetTwin - Pet Health Metrics"

**Custom Metrics (to emit from backend):**

- `pettwin.pet.heart_rate` (gauge)
- `pettwin.pet.activity_score` (gauge)
- `pettwin.pet.gait_symmetry` (gauge)
- `pettwin.anomaly.detected` (count)
- `pettwin.anomaly.severity` (histogram)
- `pettwin.ai.inference.latency` (histogram)
- `pettwin.kafka.messages.consumed` (count)
- `pettwin.alerts.sent` (count)

**Widgets:**

- Timeseries: Heart rate trends by pet
- Heatmap: Anomaly severity distribution
- Top List: Pets with most anomalies
- Query Value: Total anomalies detected today
- Change: % change in alert rate vs yesterday

**Business Value:** Real-time pet health KPIs

---

### 5. **Monitors & Alerts**

**Dashboard Name:** "PetTwin - SLO & Alerting Status"

**Monitors to Create:**

1. **AI Latency SLO:** Alert if P95 > 2 seconds
2. **Error Rate:** Alert if error rate > 5%
3. **Kafka Consumer Lag:** Alert if lag > 100 messages
4. **Critical Anomaly:** Alert on severity > 4.0
5. **Service Downtime:** Alert if no data for 5 minutes
6. **Memory Pressure:** Alert if container memory > 80%

**Widgets:**

- Monitor Status List: All monitors
- SLO Status: Uptime %
- Alert History: Recent triggers
- MTTR: Mean time to resolution
- Alert Frequency: Alerts per day

**Business Value:** Proactive issue detection

---

### 6. **Dashboards (Meta)**

**Dashboard Name:** "PetTwin - Executive Summary"

**Widgets:**

- Big Number: Total Pets Monitored
- Big Number: Anomalies Detected (24h)
- Big Number: System Uptime %
- Big Number: Average Detection Time
- Timeseries: Anomalies over time
- Pie Chart: Anomaly types distribution
- Table: Recent critical alerts
- Note Widget: "PetTwin Care - AI-Powered Pet Health Monitoring"

**Business Value:** C-level dashboard for stakeholders

---

### 7. **Integrations**

**Dashboard Name:** "PetTwin - Integration Health"

**Integrations to Show:**

- Google Cloud Platform (Cloud Run, Vertex AI)
- Kafka (Confluent Cloud)
- Docker
- GitHub (Source Code Integration)

**Widgets:**

- Integration Status: All green
- API Call Volume: Vertex AI requests
- Kafka Throughput: Messages/sec
- GitHub Commits: Deployment frequency
- Cloud Run Requests: HTTP traffic

**Business Value:** Shows ecosystem connectivity

---

### 8. **Synthetics (Optional)**

**Dashboard Name:** "PetTwin - User Experience Monitoring"

**Synthetic Tests:**

- Frontend Load Time: https://petai-tau.vercel.app
- API Health Check: Backend /health endpoint
- End-to-End Test: Submit telemetry → Receive alert

**Widgets:**

- Test Results: Pass/Fail status
- Response Time: P50/P95/P99
- Uptime %: Last 30 days
- Geographic Performance: If multi-region

**Business Value:** User-facing SLA monitoring

---

## Implementation Priority

### Phase 1: Core Dashboards (Must-Have)

1. Executive Summary
2. AI Pipeline Performance (APM)
3. Pet Health Metrics

### Phase 2: Technical Depth (Should-Have)

4. Infrastructure Health
5. Logs Audit Trail
6. Monitors & SLO Status

### Phase 3: Advanced (Nice-to-Have)

7. Integration Health
8. Synthetics

---

## Datadog API Automation

Since we can't click through the UI for every widget, we'll use:

1. **Terraform** (already created in `infrastructure/datadog/`)
2. **Datadog API** (Python script to create dashboards programmatically)
3. **Dashboard JSON** (export/import via UI)

---

## Metrics Emission Strategy

**Update `backend/confluent_consumer_ai.py` to emit DogStatsD metrics:**

```python
from datadog import statsd

# After anomaly detection
statsd.increment('pettwin.anomaly.detected', tags=[f'pet_id:{pet_id}', f'severity:{severity}'])
statsd.histogram('pettwin.anomaly.severity', severity)
statsd.gauge('pettwin.pet.heart_rate', heart_rate, tags=[f'pet_id:{pet_id}'])

# After AI inference
statsd.histogram('pettwin.ai.inference.latency', latency_ms)
```

**Add to `requirements.txt`:**

```
datadog>=0.44.0
```

---

## Expected Hackathon Impact

**Before:** Basic monitoring (2-3 dashboards)
**After:** Enterprise observability (8 dashboards, 15+ monitors, custom metrics)

**Judge Reaction:**

> "This team didn't just build a demo—they built a production system. The observability alone shows they understand how to operate AI at scale. Clear winner."

**Estimated Score Boost:** +15 points (out of 100)
