# Datadog Full Integration Guide
## Making PetTwin Care Visible in ALL Datadog Sections

This guide shows you how to make your PetTwin Care monitoring appear in **every relevant section** of Datadog's UI for maximum impact during hackathon judging.

---

## 🎯 Integration Overview

After this setup, PetTwin Care will appear in:

| Datadog Section | What Shows Up | Status |
|----------------|---------------|--------|
| 📊 **Dashboards** | 2 dashboards (Technical + Executive) | ✅ Implemented |
| 🔔 **Monitoring** | 12 monitors + 5 SLOs | ✅ Implemented |
| 🔍 **APM** | Traces of Vertex AI calls, Kafka operations | ✅ NEW! |
| 🖥️ **Infrastructure** | Docker containers, processes | ✅ Configured |
| 🤖 **AI Observability** | LLM calls to Gemini Pro | ✅ NEW! |
| 📈 **Metrics** | 15+ custom `pettwin.*` metrics | ✅ Implemented |
| 📝 **Logs** | Application logs from all services | ✅ Configured |
| 🔌 **Integrations** | Kafka, Docker, Python | ✅ Auto-detected |

---

## 🚀 Quick Setup

### 1. Install New Dependencies

```bash
cd backend
pip install ddtrace>=2.9.0
```

### 2. Update Environment Variables

```bash
# Add to .env or export
export DD_APM_ENABLED=true
export DD_TRACE_AGENT_PORT=8126
export DD_SERVICE=pettwin-care
export DD_ENV=production
export DD_VERSION=1.0.0
```

### 3. Deploy Services

```bash
# Rebuild backend with new dependencies
docker-compose build backend

# Start all services
docker-compose up -d

# Verify APM is working
docker logs backend | grep "APM"
# Should see: "✅ Datadog APM initialized successfully"
```

### 4. Generate Traffic

```bash
# Run producer to generate metrics
cd backend
python confluent_producer.py --duration 120

# APM traces will appear in 1-2 minutes
```

---

## 📊 What You'll See in Each Section

### 1. Dashboards
**URL**: https://app.datadoghq.eu/dashboard/list

**What's There:**
- ✅ "PetTwin Care - AI Health Monitoring & LLM Observability" (Technical)
- ✅ "PetTwin Care - Executive Summary" (Business view)

**Screenshot Tip**:
- Show all 8 widgets with live data
- Highlight anomaly detection overlay
- Show SLO status

---

### 2. Monitoring
**URL**: https://app.datadoghq.eu/monitors/manage

**Filter**: `tag:project:pettwin-care`

**What's There:**
- ✅ 12 monitors (6 core + 6 advanced)
- ✅ Status indicators (OK/Alert/No Data)
- ✅ Alert history

**Screenshot Tip**:
- Show monitor list filtered by your tag
- Click into 1 monitor to show configuration
- Show alert notification example

---

### 3. APM (Application Performance Monitoring) 🆕
**URL**: https://app.datadoghq.eu/apm/services

**What's There:**
- ✅ Service: `pettwin-care`
- ✅ Traces showing:
  - `vertex.ai.inference` - Gemini API calls
  - `kafka.consume` - Message processing
  - `kafka.produce` - Message publishing
- ✅ Latency distribution (P50, P95, P99)
- ✅ Error rate tracking
- ✅ Service map (visual flow)

**How to Navigate:**
1. Go to APM → Services
2. Click "pettwin-care"
3. See all traces with timing breakdown
4. Click individual trace to see:
   - Full request path
   - Time spent in each component
   - Tags (pet_id, model, etc.)

**Screenshot Tips**:
- Show service list with pettwin-care
- Show trace flame graph
- Show service map

---

### 4. Infrastructure
**URL**: https://app.datadoghq.eu/containers

**Filter**: `image_name:backend` or `image_name:datadog-agent`

**What's There:**
- ✅ Docker containers:
  - `backend` - Python app with metrics
  - `datadog-agent` - Monitoring agent
  - `kafka`, `zookeeper` - Streaming infrastructure
- ✅ Container metrics:
  - CPU usage
  - Memory usage
  - Network I/O
  - Logs

**Navigate:**
1. Infrastructure → Containers
2. Filter by `image_name` or `container_name`
3. Click container to see:
   - Resource usage graphs
   - Live processes
   - Recent logs
   - Metrics collected

**Screenshot Tips**:
- Show container list
- Show backend container detail
- Show resource usage graphs

---

### 5. AI Observability (LLM Monitoring) 🆕
**URL**: https://app.datadoghq.eu/llm/overview

**What's There:**
- ✅ LLM Application: `pettwin-care-ai`
- ✅ Model: `gemini-pro`
- ✅ Metrics:
  - Request count
  - Latency (P50, P95, P99)
  - Token usage (input/output)
  - Error rate
  - Cost tracking
- ✅ Traces showing:
  - Full prompt sent to Gemini
  - Complete response received
  - Timing breakdown
  - Metadata (temperature, use_case)

**Navigate:**
1. AI Observability → LLM Observability
2. Select application: `pettwin-care-ai`
3. View:
   - Overview dashboard
   - Individual LLM calls
   - Prompt/response pairs
   - Performance metrics

**Screenshot Tips**:
- Show LLM overview with request graph
- Show individual LLM call with prompt/response
- Show cost metrics (if available)

**THIS IS HUGE for hackathon** - Shows you're monitoring AI properly! 🏆

---

### 6. Metrics
**URL**: https://app.datadoghq.eu/metric/explorer

**Search**: `pettwin.*`

**What's There:**
- ✅ All 15+ custom metrics
- ✅ Metric details:
  - Units (ms, %, bpm)
  - Tags (pet_id, model, topic)
  - Description
  - Data points

**Navigate:**
1. Metrics → Explorer
2. Search: `pettwin`
3. See all metrics:
   - `pettwin.vertex.ai.inference.latency`
   - `pettwin.kafka.consumer.lag`
   - `pettwin.pet.health.anomaly.accuracy`
   - `pettwin.pet.health.heart_rate`
   - etc.

**Screenshot Tips**:
- Show metric search results
- Graph 2-3 key metrics
- Show metric details panel

---

### 7. Logs
**URL**: https://app.datadoghq.eu/logs

**Filter**: `service:pettwin-care`

**What's There:**
- ✅ Application logs from backend
- ✅ Kafka logs
- ✅ Datadog agent logs
- ✅ Log levels (INFO, WARNING, ERROR)
- ✅ Structured logging with context

**Navigate:**
1. Logs → Explorer
2. Filter: `service:pettwin-care`
3. See:
   - Real-time log stream
   - Log patterns
   - Error tracking
   - Full context per log

**Screenshot Tips**:
- Show log stream with service filter
- Show log detail with full context
- Show log pattern analysis

---

### 8. Integrations
**URL**: https://app.datadoghq.eu/integrations

**What's There:**
- ✅ Docker integration (auto-detected)
- ✅ Python integration (auto-detected)
- ✅ Kafka integration (via custom metrics)

**Navigate:**
1. Integrations
2. Search for "Docker" - should show "Installed"
3. Search for "Python" - should show "Installed"

**Screenshot Tips**:
- Show integration tiles with "Installed" status
- Show Docker integration dashboard

---

## 🎬 Demo Flow for Judges

When presenting to judges, navigate like this:

### 1. Start with Dashboards (30 seconds)
```
"Let me show you our comprehensive observability setup.
First, our technical dashboard with real-time AI monitoring..."
```
- Show Technical Dashboard
- Point out: Anomaly detection, Kafka lag, Pet vitals

### 2. Show AI Observability (30 seconds) 🌟
```
"Since we're using Vertex AI Gemini, we've implemented
LLM Observability to track every AI call..."
```
- Navigate to AI Observability
- Show: LLM traces with full prompt/response
- Highlight: Latency, token usage, cost tracking

### 3. Show APM (30 seconds) 🌟
```
"We can trace individual requests through our system..."
```
- Navigate to APM → Services
- Click: pettwin-care service
- Show: Trace with Kafka → Backend → Vertex AI

### 4. Show Monitoring (20 seconds)
```
"We have 12 production monitors with ML-based anomaly detection..."
```
- Navigate to Monitors
- Filter: tag:project:pettwin-care
- Show: Monitor list, click one to show config

### 5. Show SLOs (20 seconds)
```
"We've defined 5 Service Level Objectives for reliability..."
```
- Navigate to SLOs
- Show: 99.5% availability target
- Show: Error budget tracking

### 6. Show Infrastructure (15 seconds)
```
"Everything runs in Docker with full container monitoring..."
```
- Navigate to Infrastructure → Containers
- Show: Container list with resource usage

### 7. Show Metrics (15 seconds)
```
"We're tracking 15+ custom metrics across AI, Kafka, and health..."
```
- Navigate to Metrics Explorer
- Search: pettwin
- Show: Metric list

**Total Demo Time: ~3 minutes**
**Impact: Judges see world-class observability** 🏆

---

## 📸 Screenshot Checklist

For hackathon evidence, capture these:

- [ ] **Dashboards** (2 screenshots)
  - [ ] Technical dashboard (full view)
  - [ ] Executive dashboard (SLO view)

- [ ] **APM** (3 screenshots) 🆕
  - [ ] Service list showing pettwin-care
  - [ ] Trace detail with Vertex AI call
  - [ ] Service map

- [ ] **AI Observability** (3 screenshots) 🆕
  - [ ] LLM overview dashboard
  - [ ] Individual LLM call with prompt/response
  - [ ] Performance metrics

- [ ] **Monitoring** (2 screenshots)
  - [ ] Monitor list
  - [ ] Monitor detail (example: Vertex AI Latency)

- [ ] **Infrastructure** (2 screenshots)
  - [ ] Container list
  - [ ] Backend container detail

- [ ] **Metrics** (1 screenshot)
  - [ ] Metrics Explorer with pettwin.* search

- [ ] **Logs** (1 screenshot)
  - [ ] Log stream filtered by service

- [ ] **SLOs** (1 screenshot)
  - [ ] SLO status page

**Total**: 15 screenshots covering ALL sections

---

## 🧪 Testing

### Verify APM is Working

```bash
# Check logs
docker logs backend | grep APM
# Expected: "✅ Datadog APM initialized successfully"

# Generate traffic
cd backend
python confluent_producer.py --duration 60

# Check APM after 2 minutes
# https://app.datadoghq.eu/apm/services
# Should see: pettwin-care service
```

### Verify AI Observability

```bash
# Check logs
docker logs backend | grep "LLM Observability"
# Expected: "✅ Datadog LLM Observability initialized"

# Trigger AI call
# (producer will automatically trigger anomaly → AI call)

# Check AI Observability after 2 minutes
# https://app.datadoghq.eu/llm/overview
# Should see: pettwin-care-ai application
```

### Verify All Sections

Run this checklist:

```bash
# 1. Dashboards
curl -s https://app.datadoghq.eu/api/v1/dashboard \
  -H "DD-API-KEY: $DD_API_KEY" | grep pettwin

# 2. Monitors
curl -s https://app.datadoghq.eu/api/v1/monitor \
  -H "DD-API-KEY: $DD_API_KEY" | grep pettwin

# 3. Metrics
curl -s "https://app.datadoghq.eu/api/v1/metrics?from=$(date -u -d '1 hour ago' +%s)" \
  -H "DD-API-KEY: $DD_API_KEY" | grep pettwin
```

---

## 🎯 Hackathon Impact

### Before (Basic Monitoring)
- Dashboards: 1
- Visibility: 2 sections (Dashboards, Monitoring)
- Judges see: Basic implementation

### After (Full Integration) 🆕
- Dashboards: 2
- Monitors: 12
- SLOs: 5
- APM: ✅ Full tracing
- AI Observability: ✅ LLM monitoring
- Visibility: **8 sections**
- Judges see: **Production-grade enterprise observability**

**Estimated Score Increase**: +10 points (from 85 → 95/100)

---

## 🚨 Troubleshooting

### APM Not Showing Up

```bash
# Check ddtrace is installed
pip list | grep ddtrace

# Check APM is enabled
echo $DD_APM_ENABLED

# Check agent can receive traces
docker exec datadog-agent agent status | grep -A 5 "APM"

# Force restart
docker-compose restart backend
```

### AI Observability Not Working

```bash
# LLM Obs requires ddtrace >= 2.9.0
pip install --upgrade ddtrace

# Check logs
docker logs backend 2>&1 | grep -i llm
```

### No Data in Any Section

```bash
# Check agent is running
docker ps | grep datadog-agent

# Check agent status
docker exec datadog-agent agent status

# Restart everything
docker-compose restart
```

---

## 📞 Support

- **APM Docs**: https://docs.datadoghq.com/tracing/
- **LLM Observability**: https://docs.datadoghq.com/llm_observability/
- **ddtrace Python**: https://ddtrace.readthedocs.io/

---

**Ready to impress judges with full Datadog integration!** 🏆

Next steps:
1. Rebuild backend: `docker-compose build backend`
2. Start services: `docker-compose up -d`
3. Generate traffic: `python backend/confluent_producer.py --duration 120`
4. Wait 2-3 minutes
5. Navigate through ALL 8 Datadog sections
6. Capture screenshots for evidence
7. Win hackathon! 🎉
