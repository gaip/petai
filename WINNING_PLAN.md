# PetTwin Care: Operation "Stream to Win" 🏆

## Objective

**Win the AI Partner Catalyst Hackathon - Confluent Challenge ($12,500 Prize Pool)**

Based on the audit, we are pivoting from a "generalist" submission to a **Confluent-focused masterpiece**. We will demonstrate that only Real-Time Data Streaming can save pets' lives by detecting anomalies seconds after they occur, not days later.

---

## 📅 Timeline: 48 Hours to Deadline

### Phase 1: Compliance & Cleanup (Immediate 🚨)

- **[ ] Add Open Source License**: Create `LICENSE` file (Apache 2.0 or MIT) in the root. **(CRITICAL: Disqualification Risk)**
- **[ ] Sanitize README**:
  - Remove "AWS Kiro" references.
  - Remove mentions of competing challenges (Datadog, ElevenLabs) as primary targets.
  - Refocus narrative: "Real-time Event Streaming for IoT Pet Health".
  - Update "How to Run" to include Kafka setup (using local Docker or Confluent Cloud).

### Phase 2: The Confluent Pivot (The Code)

- **[ ] Real Kafka Integration (Backend)**:
  - **Deprecate**: `backend/producer.py` (Mock buffer).
  - **Implement**: `backend/kafka_services.py` using `confluent-kafka`.
    - `Producer`: Ingests simulated sensor data -> Topic `pet-vitals`.
    - `Consumer`: Reads `pet-vitals` -> Trigger `AI Analysis` -> Push to Frontend.
- **[ ] Real-Time Frontend Updates**:
  - Update `AIAssistant.tsx` or Dashboard to fetch _real_ stream status (lag, throughput) or live data points, proving the pipeline is active.

### Phase 3: Validation & Evidence

- **[ ] "The Money Shot" (Video Demo)**:
  - Split screen:
    - **Left**: Python script generating "High Heart Rate" events.
    - **Right**: PetTwin Dashboard showing the alert appearing instantly (<500ms).
  - **Overlay**: Show Confluent Cloud Console data lineage graph.
- **[ ] Performance Benchmarks**:
  - Log "End-to-End Latency" (Sensor Generation Time vs. Alert Time). Ideally < 1 second.

---

## 📝 Implementation Architecture (Revised)

```mermaid
graph LR
    A[IoT Sensor Simulator] --"JSON Events"--> B(Confluent Cloud / Kafka)
    B --"Topic: pet-vitals"--> C[Backend Consumer Service]
    C --"Batch: 10 events"--> D{Vertex AI / Anomaly Model}
    D --"Alert Found!"--> E[Firestore / Frontend Notification]
    D --"Safe"--> F[BigQuery (Long-term Storage)]
```

## Next Steps for User

1.  **Approve this Plan**: Confirm we are going 100% for Confluent.
2.  **Configuration**: Do you have a Confluent Cloud account/API keys? Or shall we stick to a local `docker-compose` Kafka (redpanda/kafka) for the demo?
    - _Recommendation_: Local Docker is safer/faster for dev, but Confluent Cloud looks better for the specific prize.
3.  **Execute Phase 1**: I will fix the License and README immediately.
