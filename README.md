# 🐾 PetTwin Care

> **Real-Time Pet Health Monitoring via AI & Data Streaming**

[![Deployed](https://img.shields.io/badge/Live%20Demo-petai--tau.vercel.app-blue)](https://petai-tau.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Confluent](https://img.shields.io/badge/Powered%20by-Confluent%20Cloud-orange)](https://confluent.cloud)
[![Google Cloud](https://img.shields.io/badge/AI-Vertex%20AI%20%26%20Gemini-red)](https://cloud.google.com/vertex-ai)

**🏆 AI Partner Catalyst Hackathon - Confluent Challenge Submission**

---

## 🎯 The Problem: Silent Suffering

**Veterinarians have a suicide rate 3-5x higher than the general population.**

Why? They see beloved pets arrive with treatable conditions—caught too late. Hip dysplasia, kidney disease, arthritis—all show subtle behavioral changes **2-3 weeks before visible symptoms**. But pets instinctively hide pain. By the time owners notice limping or lethargy, the disease has progressed significantly.

**What if we could detect these changes in real-time?**

---

## 💡 The Solution: Real-Time Behavioral Streaming

PetTwin Care creates a personalized AI health baseline for each pet, then **streams continuous behavioral telemetry** through Confluent Cloud to detect anomalies before they become emergencies.

### Why Confluent? Why Real-Time Matters.

Traditional approaches collect data in batches (daily summaries, weekly vet visits). But health events happen in **moments**:

- A dog favoring one leg during a morning walk
- Irregular heart rate during afternoon play
- Disrupted sleep patterns overnight

**Confluent Cloud enables us to catch these micro-events as they happen**, building a rich temporal dataset that reveals patterns invisible to batch processing.

---

## 📊 Validated Performance

**Detection Accuracy**: **92.0%** (46/50 cases correctly identified)
**Early Warning**: **7.6 days** average lead time before visible symptoms
**Precision**: 95.8% (minimal false alarms)

### Performance by Severity

| Severity     | Accuracy | Days Early Detection |
| ------------ | -------- | -------------------- |
| **Mild**     | 88.9%    | 5.4 days             |
| **Moderate** | 100.0%   | 7.6 days             |
| **Severe**   | 100.0%   | 12.2 days            |

**Key Insight**: Life-threatening conditions (heart failure, advanced kidney disease) detected earliest when intervention matters most.

**Full Validation Study**: [`docs/VALIDATION_STUDY.md`](docs/VALIDATION_STUDY.md)

---

## 🏗️ Architecture: Confluent + Vertex AI

```
Pet Sensors → Confluent Kafka → AI Processor → Natural Language Alert → Owner
     ↓              ↓                  ↓                ↓                  ↓
  Raw data    Stream buffer      Anomaly detect    Gemini explanation   Action
  (2s freq)   (pet-health-       (Z-score > 2.5σ)  ("MAX is limping")   (Call vet)
              stream topic)
```

### Data Flow

1. **Data Ingestion** (Confluent Producer)

   - Smartphone camera analyzes gait via computer vision
   - Optional smart collar sends BLE heart rate data
   - Produces to `pet-health-stream` topic every 2 seconds
   - Schema: `{pet_id, timestamp, heart_rate, activity_score, gait_symmetry, sleep_quality}`

2. **Stream Processing** (Confluent Consumer)

   - Consumer group: `pettwin-ai-processor`
   - Maintains rolling 30-point window (~1 minute baseline)
   - Calculates statistical anomalies (Z-score detection)
   - Triggers AI pipeline on threshold breach

3. **AI Inference** (Vertex AI)

   - Anomaly detection using statistical process control
   - Vertex AI Gemini generates natural language alerts
   - Example: _"We've noticed MAX is moving 30% less than usual and their heart rate is elevated (+18 bpm). This pattern is consistent with joint discomfort. Monitor closely for 24 hours and contact your vet if it persists."_

4. **Real-Time Sync** (Firestore + Next.js)
   - Alerts pushed to pet owner's dashboard instantly
   - 30-day health history visualization
   - Pre-visit summaries for veterinarians

---

## 🔬 Technical Implementation

### Confluent Integration

**Producer** (`backend/confluent_producer.py`):

```python
from confluent_kafka import Producer

CONFLUENT_CONFIG = {
    'bootstrap.servers': 'pkc-xxxxx.confluent.cloud:9092',
    'security.protocol': 'SASL_SSL',
    'sasl.mechanisms': 'PLAIN',
    'sasl.username': CONFLUENT_API_KEY,
    'sasl.password': CONFLUENT_API_SECRET,
    'acks': 'all',  # Ensure durability
    'compression.type': 'snappy'
}

producer = Producer(CONFLUENT_CONFIG)
producer.produce('pet-health-stream', key=pet_id, value=telemetry_json)
```

**Consumer** (`backend/confluent_consumer_ai.py`):

```python
from confluent_kafka import Consumer
from vertexai.generative_models import GenerativeModel

consumer = Consumer({
    **CONFLUENT_CONFIG,
    'group.id': 'pettwin-ai-processor',
    'auto.offset.reset': 'earliest'
})

consumer.subscribe(['pet-health-stream'])

while True:
    msg = consumer.poll(timeout=1.0)
    data = json.loads(msg.value())

    # Real-time anomaly detection
    anomaly = detector.detect_anomaly(data)

    if anomaly['is_anomaly']:
        # Generate natural language alert via Gemini
        alert = gemini.generate_content(
            f"Explain this health anomaly: {anomaly}"
        )
        send_to_owner(alert)
```

### Why This Qualifies for Confluent Challenge

✅ **Real-Time Data Streaming**: Pet health telemetry streamed to Confluent Cloud
✅ **Advanced AI/ML**: Vertex AI anomaly detection + Gemini NL generation
✅ **Novel Application**: First real-time streaming solution for pet health monitoring
✅ **Compelling Problem**: Saves pet lives + reduces vet burnout (3-5x suicide rate)
✅ **Production Ready**: Deployed at [petai-tau.vercel.app](https://petai-tau.vercel.app)

---

## 📊 Demo & Evidence

### Live Demo

**URL**: https://petai-tau.vercel.app
**Source Code**: https://github.com/gaip/petai
**Video**: https://youtu.be/r1d-tVPNA74

### Technical Proof

1. **Confluent Integration**

   - Producer: [`backend/confluent_producer.py`](backend/confluent_producer.py)
   - Consumer: [`backend/confluent_consumer_ai.py`](backend/confluent_consumer_ai.py)
   - Demo Notebook: [`backend/demo_confluent_vertexai.ipynb`](backend/demo_confluent_vertexai.ipynb)

2. **Architecture Diagram**

   - Generator script: [`docs/architecture_diagram.py`](docs/architecture_diagram.py)
   - Visual: `docs/pettwin_architecture.png`

3. **Evidence Package**
   - Run: `./scripts/generate_evidence.sh`
   - Outputs: Producer logs, consumer logs, code stats, proof checklist

---

## 🚀 Quick Start

### Prerequisites

- Python 3.9+
- Node.js 18+
- Confluent Cloud account ([free trial](https://confluent.cloud))
- Google Cloud account (optional, for Gemini)

### 1. Clone Repository

```bash
git clone https://github.com/gaip/petai.git
cd petai
```

### 2. Set Up Confluent Credentials

```bash
export CONFLUENT_BOOTSTRAP_SERVERS='pkc-xxxxx.us-east-1.aws.confluent.cloud:9092'
export CONFLUENT_API_KEY='your-api-key'
export CONFLUENT_API_SECRET='your-api-secret'
```

### 3. Run Producer (Data Ingestion)

```bash
cd backend
pip install confluent-kafka
python confluent_producer.py --pet-id MAX_001 --duration 120
```

### 4. Run Consumer + AI (Stream Processing)

```bash
# In a new terminal
pip install confluent-kafka google-cloud-aiplatform
export GCP_PROJECT_ID='your-gcp-project'
python confluent_consumer_ai.py
```

### 5. Watch Real-Time Anomaly Detection!

```
🎧 Listening to pet health stream from Confluent Cloud...
🧠 Vertex AI anomaly detection: ACTIVE
────────────────────────────────────────────────────────────────────────────────
📨 Message #45 | Pet: MAX_001 | Time: 2025-12-29T14:32:15
   💓 HR: 112 bpm | 🏃 Activity: 48/100 | 🦴 Gait: 0.71 | 😴 Sleep: 0.58

🚨 ANOMALY #1 DETECTED!
   📊 Type: heart_rate_elevated (z=3.2), activity_reduced (z=-2.8), gait_asymmetric (z=-3.1)
   ⚡ Severity: 3.2

🤖 Generating owner alert via Vertex AI Gemini...

💬 ALERT MESSAGE:
════════════════════════════════════════════════════════════════════════════════
⚠️ ATTENTION NEEDED: We've noticed MAX is moving significantly less than
usual, their heart rate is elevated, and they're showing signs of gait
asymmetry. This pattern could indicate joint discomfort or early arthritis.
Monitor closely for the next 24-48 hours. If MAX continues to favor one leg
or seems reluctant to move, contact your veterinarian.
════════════════════════════════════════════════════════════════════════════════
```

---

## 🎯 Confluent Challenge: Why We Win

### 1. Perfect Use Case for Real-Time Streaming

**Problem**: Health events are temporal. A single data point means nothing. A pattern over time reveals everything.

**Confluent Solution**: Stream 1 data point every 2 seconds → build rolling baseline → detect deviations in real-time.

Traditional batch processing (daily summaries) would miss the 90-second window where a dog limped during a walk. Confluent's streaming architecture captures every moment.

### 2. Advanced AI/ML on Streaming Data

**Challenge Requirement**: _"Apply advanced AI/ML models to any real-time data stream"_

**Our Implementation**:

- Statistical process control (Z-score anomaly detection) on streaming data
- Vertex AI for pattern recognition
- Gemini Pro for natural language generation
- **Result**: Transform raw telemetry → actionable owner alerts in <2 seconds

### 3. Novel & Compelling Application

**Social Impact**:

- **Pets**: Early detection = better outcomes, longer lives
- **Owners**: Peace of mind, reduced anxiety
- **Vets**: Data-driven pre-visit summaries, reduced burnout (3-5x suicide rate)

**Innovation**:

- First real-time streaming platform for pet health
- Multi-sensor fusion (video CV + BLE + behavioral data)
- Continuous learning (each pet's baseline adapts over time)

### 4. Production Quality

✅ Deployed application with real users
✅ Production-grade Confluent config (SASL_SSL, acks=all, compression)
✅ Error handling & graceful degradation
✅ Open-source (MIT license)
✅ Comprehensive documentation & evidence

---

## 📈 What's Next (Beyond Hackathon)

### Phase 1: Kafka Streams Integration

- Window aggregations for trend analysis
- Multi-pet correlation detection (e.g., "3 dogs in your neighborhood showing similar symptoms")
- Real-time vet dashboard queries

### Phase 2: ksqlDB for Analytics

```sql
SELECT pet_id, AVG(heart_rate) AS avg_hr, MAX(anomaly_score) AS max_anomaly
FROM pet_health_stream
WINDOW TUMBLING (SIZE 5 MINUTES)
GROUP BY pet_id
HAVING max_anomaly > 0.8;
```

### Phase 3: Confluent Connectors

- **BigQuery Sink**: Population health analytics
- **Elasticsearch Sink**: Full-text search of health events
- **S3 Sink**: Long-term archival for regulatory compliance

### Phase 4: Schema Registry

- Avro schema evolution for backward-compatible IoT devices
- Schema validation at ingestion
- Data governance & compliance

---

## 🏆 Hackathon Submission Details

### Challenge

**Confluent Challenge**: Apply advanced AI/ML models to any real-time data stream to generate predictions, create dynamic experiences, or solve a compelling problem in a novel way.

### Team

**Solo Developer**: Hasan Turhal
**Contact**: [GitHub @gaip](https://github.com/gaip)

### Technology Stack

- **Streaming**: Confluent Cloud (Kafka)
- **AI/ML**: Google Cloud Vertex AI, Gemini Pro
- **Backend**: Python, FastAPI, Cloud Run
- **Frontend**: Next.js, React, Tailwind CSS
- **Database**: Firestore, BigQuery
- **Deployment**: Vercel (frontend), Railway (backend)

### Links

- **Live Demo**: https://petai-tau.vercel.app
- **Source Code**: https://github.com/gaip/petai
- **Video**: https://youtu.be/r1d-tVPNA74
- **License**: [MIT](LICENSE)

---

## 🐾 Impact Story

> _"Our 8-year-old Golden Retriever, Buddy, started limping one morning. By the time we got to the vet, his hip dysplasia had progressed to the point where surgery was the only option. If we had caught it two weeks earlier during the subtle behavioral changes, physical therapy could have managed it. Buddy would have avoided surgery. We would have avoided $8,000 in vet bills and the guilt of not noticing sooner."_
> — Pet owner (composite story from real cases)

**PetTwin Care makes that "two weeks earlier" detection possible.**

Not with expensive lab equipment. Not with invasive procedures. Just with a smartphone camera, real-time streaming via Confluent, and AI that understands what "normal" looks like for _your_ pet.

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Confluent Cloud** for making real-time data streaming accessible
- **Google Cloud Vertex AI** for powerful, scalable AI/ML infrastructure
- **Veterinarians** who inspired this project by sharing their struggles with preventable cases
- **Pet owners** who deserve peace of mind

---

**Built with ❤️ for pets, vets, and the humans who love them.**

_PetTwin Care: Because your pet can't tell you when something's wrong. But their data can._
