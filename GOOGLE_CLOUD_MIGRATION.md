# ☁️ Google Cloud Hosting Migration Plan

**Objective**: Migrate "PetTwin Care" to a pure Google Cloud architecture using Cloud Run, Cloud Build, and Vertex AI.

---

## 🏗 Architecture Overview

| Component     | Current                | **Google Cloud Target**  | Benefits                                     |
| ------------- | ---------------------- | ------------------------ | -------------------------------------------- |
| **Frontend**  | Next.js (Local/Vercel) | **Cloud Run (Service)**  | scalable, secure, runs in Google network     |
| **Backend**   | Python (Local)         | **Cloud Run (Worker)**   | auto-scaling, direct IAM access to Vertex AI |
| **AI Model**  | Vertex AI (External)   | **Vertex AI (Internal)** | lower latency, no API keys needed (IAM)      |
| **Database**  | Firestore              | **Firestore (Native)**   | seamless integration                         |
| **Streaming** | Confluent Cloud        | **Confluent Cloud**      | (remains external partner resource)          |

---

## 🚀 Migration Steps

### Phase 1: Authentication & Setup (Current Step)

1. ✅ **Authenticate CLI**: `gcloud auth application-default login` (In Progress).
2. [ ] **Set Project**: `gcloud config set project mindful-pillar-482716-r9`.
3. [ ] **Enable Services**:
   ```bash
   gcloud services enable run.googleapis.com \
                          cloudbuild.googleapis.com \
                          artifactregistry.googleapis.com
   ```

### Phase 2: Dockerize Application

We need `Dockerfile`s for both services.

**1. Frontend Dockerfile (`frontend/Dockerfile`)**

- Standard Next.js standalone build.
- Expose port 3000 (or 8080 for Cloud Run).

**2. Backend Dockerfile (`backend/Dockerfile`)**

- Python 3.10 slim image.
- Install `confluent-kafka`, `google-cloud-aiplatform`.
- Setup entrypoint to run `confluent_consumer_ai.py`.

### Phase 3: Build & Push

Create an Artifact Registry repo:

```bash
gcloud artifacts repositories create pettwin-repo \
    --repository-format=docker \
    --location=us-central1
```

Build images using Cloud Build (no local Docker required!):

```bash
gcloud builds submit --tag us-central1-docker.pkg.dev/mindful-pillar-482716-r9/pettwin-repo/backend ./backend
gcloud builds submit --tag us-central1-docker.pkg.dev/mindful-pillar-482716-r9/pettwin-repo/frontend ./frontend
```

### Phase 4: Deploy to Cloud Run

**1. Deploy Backend (Consumer Worker)**

- Needs CPU always allocated (streaming).

```bash
gcloud run deploy pettwin-backend \
    --image us-central1-docker.pkg.dev/mindful-pillar-482716-r9/pettwin-repo/backend \
    --no-cpu-throttling \
    --min-instances 1 \
    --set-env-vars CONFLUENT_BOOTSTRAP_SERVERS=...,CONFLUENT_API_KEY=...,PROJECT_ID=mindful-pillar-482716-r9
```

**2. Deploy Frontend (Web App)**

```bash
gcloud run deploy pettwin-frontend \
    --image us-central1-docker.pkg.dev/mindful-pillar-482716-r9/pettwin-repo/frontend \
    --allow-unauthenticated
```

---

## 🏆 Hackathon "Best Possible" Implementation

By moving to **Cloud Run**, we demonstrate:

1.  **Production Readiness**: "Serverless containers" is the modern standard.
2.  **Security**: Use **Service Accounts** instead of API keys.
3.  **Performance**: Frontend and Backend run in the same Google Cloud region (`us-central1`) as Vertex AI, minimizing latency.

## ✅ Next Immediate Actions

1. Complete login in browser.
2. Confirm `test_vertex_connection.py` works.
3. Generate `Dockerfile`s (I will create these for you).
