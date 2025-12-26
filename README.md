# PetTwin Care
**Your Pet Can't Tell You When Something's Wrong. We Built Something That Can.**
*Built for the AWS Kiro Hackathon 2025 | Social Impact Track* (Note: Pivoted to GCP infrastructure as requested)

## Hackathon Submission Details (For Judges)

### Additional Info
*   **Google Cloud Products Used**: Vertex AI, Gemini API, Cloud Run, Firestore, BigQuery, Cloud Functions, Firebase, Pub/Sub, Cloud Storage
*   **Other Tools**: Datadog APM, Datadog Logs, Datadog Metrics, Python, JavaScript, React, Node.js, Docker
*   **First time using Datadog tools?**: Yes
*   **First time using Confluent tools?**: Yes
*   **First time using ElevenLabs tools?**: Yes

### Links
*   **Source Code**: [https://github.com/gaip/petai](https://github.com/gaip/petai)
*   **Hosted Project**: https://pettwincare.app
*   **Video Demo**: https://youtu.be/r1d-tVPNA74

## Partner Challenges
We have integrated technologies to qualify for multiple track challenges:

### 1. Confluent Challenge (Real-time Streaming)
We successfully integrated **Confluent Kafka** to handle the continuous stream of physiological data (heart rate, movement) from pets to our Google Cloud AI backend for real-time anomaly detection.

### 2. ElevenLabs Challenge (Voice Interface)
We gave our AI a voice using **ElevenLabs**. The "Pet Voice" feature translates complex health data into natural, comforting spoken alerts, making the interface more conversational and less clinical for anxious owners.

## Inspiration
Veterinarians have a suicide rate 3-5x higher than the general population, largely due to seeing preventable cases arrive too late. Pets instinctively hide pain, making early disease detection nearly impossible for owners. By the time symptoms are visible, diseases have often progressed significantly.

## What it does
PetTwin Care creates a personalized AI health baseline for each pet using Google Cloud's AI ecosystem and real-time streaming data. Through smartphone tracking and optional low-cost sensors, we monitor behavior patterns and detect anomalies 2-3 weeks before visible symptoms appear. The system leverages:

*   **Vertex AI** for custom anomaly detection models
*   **Gemini** for natural language health insights and owner communications
*   **Confluent (Kafka)** for real-time sensor data streaming and ingestion
*   **ElevenLabs** for "Pet Voice" audio alerts
*   **Datadog** for observability and health monitoring
*   **Cloud Run** for scalable microservices architecture
*   **Firestore** for real-time health data synchronization
*   **BigQuery** for population health analytics

## Architecture & Implementation Plan

We have designed a robust, scalable architecture leveraging **Google Cloud Platform (GCP)**, **Confluent (Kafka)**, **ElevenLabs**, and **Datadog**.

### Phase 1: Core Data Pipeline & Digital Twin Baseline
This phase establishes the foundational infrastructure for data ingestion, streaming, and personalized health baseline calculation.

| Component             | Tech Stack equivalent | Key Features & Rationale                                                                                                                                                                                                                           |
| :-------------------- | :------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Data Ingestion**    | **GCP Cloud Pub/Sub** (IoT Gateway)         | Replaces AWS IoT Core. Highly scalable, decoupled messaging for ingesting pet video analysis (Edge ML results), optional BLE sensor data, and owner input.                                                                                         |
| **Data Streaming**    | **Confluent Cloud (Kafka)**                 | Central data backbone. All raw data streams through Kafka topics (e.g., `raw_activity`, `sensor_events`) for reliable processing and replayability.                                                            |
| **Database**          | **GCP Firestore** (NoSQL)                   | Stores pet profiles, owner accounts, and the rolling 30-day health baseline (Digital Twin). Offers low-latency access for the user app.                                                                                         |
| **Anomaly Detection** | **GCP Cloud Run** (Microservice)            | A containerized service (Python/FastAPI) subscribes to Kafka topics, calculates the 7-day rolling baseline from Firestore, and applies the Isolation Forest/Z-Score model. Writes results to a new Kafka topic (`anomaly_alerts`). |
| **Backend API**       | **GCP Cloud Run / FastAPI**         | RESTful API for mobile app, managing profiles, and serving real-time Health Scores.                                                                                                                         |

### Phase 2: Predictive Intelligence & User Experience
This phase builds the intelligence layer, focusing on generating predictive alerts and a compelling user experience.

| Component                         | Tech Stack equivalent          | Key Features & Rationale                                                                                                                                                                                                          |
| :-------------------------------- | :--------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Natural Language** | **GCP Cloud Functions** + **Vertex AI** | The Gemini API is used to perform prompt chaining to generate contextual, owner-friendly text alerts based on the raw anomaly data.                             |
| **Voice Alerts**                  | **ElevenLabs API**                                   | The generated text from Vertex AI is sent to the ElevenLabs API to create a unique, urgent, and professional voice-over for the "Smart Alert" feature.  |
| **Mobile/Web App**                | **Google Firebase / Next.js**              | Provides reliable user authentication, real-time updates via Firestore, and robust push support.                                                                          |
| **Analytics**         | **GCP BigQuery**                                     | Used for trend visualization, deep-dive vet reports, and training new AI models. Data streams from Kafka into BigQuery via a Confluent Connector. |

### Phase 3: Observability & Scale
The final phase focuses on scaling the system and establishing end-to-end monitoring.

| Component                      | Tech Stack equivalent | Key Features & Rationale                                                                                                                                                                                                                                                                             |
| :----------------------------- | :------------------------------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Monitoring** | **Datadog** (APM, Logs, Metrics)            | Datadog Agents and Tracers are deployed across all Cloud Run services to provide full-stack Application Performance Monitoring (APM), tracing, and consolidated logging. |
| **Veterinary Portal**          | **GCP Compute Engine**                | Hosts the web-based portal. Provides the Pre-visit Health Summaries, integrating with the **BigQuery** time-series data.                                                                                                                                                        |

## The "AI Agent" Concept
At the heart of PetTwin Care is the **AI Agent**, powered by **Google Cloud Vertex AI**. 
*   **Role**: It acts as the bridge between complex sensor data (ingested via Confluent) and the pet owner.
*   **Function**: Instead of just showing raw charts, the Agent analyzes the `anomaly_alerts` stream, synthesizes a natural language explanation using Gemini, and can even speak to the owner via ElevenLabs.
*   **Guidance**: The Agent lives in the application (see the bottom-right chat bubble) to guide users through the process, explaining how their data is being analyzed in real-time.

## 🚀 Speed Run (Local Demo)
Want to see it in action without configuring cloud keys?

1.  **Clone the repo**
    ```bash
    git clone https://github.com/gaip/petai.git
    cd petai
    ```

2.  **Start the Backend (Brain)**
    ```bash
    cd backend
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    uvicorn main:app --reload
    ```

3.  **Start the Frontend (Face)**
    ```bash
    # Open a new terminal
    cd frontend
    npm install
    npm run dev
    ```

4.  **Open Demo**
    Visit `http://localhost:3000` to start the PetTwin experience.

## ☁️ Deployment (Live)

The project is deployed using **Railway** (Backend + Kafka) and **Vercel** (Frontend).

*   **Backend**: Deployed on Railway using Docker.
    *   `POST /api/pets`: Registers new pet.
    *   `GET /api/pets`: Returns dynamic list of pets.
    *   **Kafka**: Managed within Railway service stack.
*   **Frontend**: Deployed on Vercel.
    *   Connects to Backend via `NEXT_PUBLIC_API_URL` environment variable.

### Deploying Yourself

**Backend (Railway)**
1.  Fork repo and login to Railway.
2.  Import repo and select `/backend` as root.
3.  Add `kafka` and `zookeeper` services manually or use the provided `docker-compose.yml`.

**Frontend (Vercel)**
1.  Import `/frontend` directory to Vercel.
2.  Add Environment Variable: `NEXT_PUBLIC_API_URL` (Your Railway Backend URL).
3.  Deploy!
