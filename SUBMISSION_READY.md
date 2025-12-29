# 🏆 PetTwin Care - Final Submission Manifest

**Status**: 100% Submission Ready
**Technology Stack**: Google Cloud Run (Serverless) + Vertex AI (Gemini Pro) + Confluent Cloud (Kafka)

---

## 🌍 LIVE WEB DEMO

- **Frontend UI**: [https://pettwin-frontend-587597274680.us-central1.run.app](https://pettwin-frontend-587597274680.us-central1.run.app)
- **Backend API**: [https://pettwin-backend-587597274680.us-central1.run.app](https://pettwin-backend-587597274680.us-central1.run.app)

---

## 🔧 Backend Configuration (Critical)

The Backend is currently deployed but needs **Confluent Cloud Credentials** to be 100% operational.
**Action Required:**

1.  Go to [Google Cloud Run Console](https://console.cloud.google.com/run/detail/us-central1/pettwin-backend/revisions).
2.  Click **Edit & Deploy New Revision**.
3.  Add Environment Variables:
    - `CONFLUENT_BOOTSTRAP_SERVERS`: `pkc-619z3.us-east1.gcp.confluent.cloud:9092`
    - `CONFLUENT_API_KEY`: _(Your Key)_
    - `CONFLUENT_API_SECRET`: _(Your Secret)_
4.  Click **Deploy**.

---

## ⚡️ Architecture Highlights

1.  **Frontend**: Next.js 14 on Cloud Run. Real-Time Polling Dashboard.
2.  **Backend**: Python Worker on Cloud Run.
    - Connects to **Confluent Cloud** (`pkc-619z3...`).
    - Uses **Vertex AI Gemini Pro** for anomaly analysis.
3.  **Deployment**: Fully containerized with Docker and Cloud Build.

---

## 📸 Assets & Proof

- **Code**: GitHub Main Branch.
- **Screenshots**: `/devpost_screenshots/`
- **Video**: Record using the live URL above!

**Good Luck! You have a pure Google Cloud Native deployment.** 🚀
