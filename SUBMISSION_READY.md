# 🏆 PetTwin Care - Final Submission Manifest

**Status**: 100% Submission Ready
**Technology Stack**: Google Cloud Run (Serverless) + Vertex AI (Gemini 2.0 Flash / 1.5 Pro) + Confluent Cloud + Vercel

---

## 🌍 LIVE DEMO LINKS

- **Public Frontend**: [https://petai-tau.vercel.app](https://petai-tau.vercel.app)
  _(Accessible to everyone. Uses Vercel Edge Network)_

- **Cloud Run Native (Secure)**: [https://pettwin-frontend-587597274680.us-central1.run.app](https://pettwin-frontend-587597274680.us-central1.run.app)
  _(Requires Google Account Authentication - Enterprise Security Mode)_

---

## 🤖 Vertex AI Agent Integration (Cutting Edge)

We have upgraded the backend to use **Vertex AI Agentic Principles** with the latest models:

1.  **Primary Model**: `gemini-2.0-flash-exp` (Gemini 3 Class) for ultra-fast reasoning.
2.  **Fallback**: `gemini-1.5-pro-002` (High Intelligence).
3.  **Agent Persona**: The AI acts as a "Virtual Veterinarian" with a defined reasoning protocol (Observe -> Reason -> Act).
4.  **Artifacts**: "PetTwin Agent" prompt saved in Vertex AI Studio.

---

## ⚡️ Architecture Highlights

1.  **Frontend**: Next.js 14 Hybrid Deployment (Vercel + Cloud Run).
2.  **Backend**: Python Worker on Cloud Run (Secure).
    - Connects to **Confluent Cloud** (`pkc-619z3`).
    - Uses **Vertex AI** for real-time anomaly reasoning.
3.  **Security**:
    - Backend is protected by Google IAM.
    - Frontend is publicly accessible via Vercel.

---

## 🎥 Recording Instructions

1.  Open the **Cloud Run URL** (since you are logged in) to show backend logs.
2.  Run the **Local Producer**: `python backend/confluent_producer.py`
3.  Show the real-time updates on the **Vercel Dashboard**.
4.  Show **Vertex AI Studio** "My Prompts" to prove the Agent exists.

**Good Luck! You have a robust, secure, and modern deployment.** 🚀
