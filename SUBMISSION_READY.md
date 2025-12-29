# 🏆 PetTwin Care - Final Submission Manifest

**Status**: 100% Submission Ready
**Technology Stack**: Google Cloud Run (Serverless) + Vertex AI (Gemini 2.0/1.5) + Confluent Cloud + Datadog + Vercel

---

## 🌍 LIVE DEMO LINKS

- **Public Frontend**: [https://petai-tau.vercel.app](https://petai-tau.vercel.app)
  _(Accessible to everyone. Uses Vercel Edge Network)_

- **Cloud Run Native (Secure)**: [https://pettwin-frontend-587597274680.us-central1.run.app](https://pettwin-frontend-587597274680.us-central1.run.app)
  _(Requires Google Account Authentication - Enterprise Security Mode)_

---

## 🤖 Vertex AI Agent Integration (Cutting Edge)

We have upgraded the backend to use **Vertex AI Agentic Principles**:

1.  **Primary Model**: `gemini-2.0-flash-exp` (Gemini 3 Class) / `gemini-1.5-pro`.
2.  **Agent Persona**: "Virtual Veterinarian" with (Observe -> Reason -> Act) protocol.
3.  **Artifacts**: "PetTwin Agent" prompt saved in Vertex AI Studio.

---

## 📊 Datadog Monitoring (Challenge Requirement)

**Dashboard**: [PetTwin Care - AI Health Monitoring](https://app.datadoghq.eu/dashboard/t7g-ubd-aet)
**Monitors**: [Vertex AI Gemini Anomaly Detection](https://app.datadoghq.eu/monitors/96636457)

- **AI Latency Tracking**: Real-time visualization of Gemini inference speed.
- **Anomaly Alerts**: Automated incidents when model performance degrades.
- **Incident Workflow**: Integrated alerting system.

---

## ⚡️ Architecture Highlights

1.  **Frontend**: Next.js 14 Hybrid Deployment.
2.  **Backend**: Python Worker on Cloud Run (Secure).
3.  **Data**: Confluent Cloud Kafka Streaming.

---

## 📸 Evidence Checklist

- [x] **Vercel Dashboard** (Live Site)
- [x] **Vertex AI Studio** (Prompt Artifact)
- [x] **Datadog Dashboard** (Screenshots in `docs/`)
- [x] **Cloud Run Logs** (Backend Activity)

---

## 🎥 Recording Instructions

1.  Open **Cloud Run URL** to show backend logs.
2.  Run the **Local Producer**: `python backend/confluent_producer.py`
3.  Show updates on **Vercel Dashboard**.
4.  Show **Vertex AI Studio** Prompt.
5.  Show **Datadog Dashboard**.

**Good Luck! You have a robust, secure, and modern deployment.** 🚀
