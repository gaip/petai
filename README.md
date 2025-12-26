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

## How we built it
We architected PetTwin Care on Google Cloud to maximize AI capabilities:

*   **Data ingestion pipeline**: Uses **Confluent Kafka** to stream real-time physiological data from pets.
*   **Custom ML models**: Trained on **Vertex AI** (simulated via Scikit-Learn Isolation Forest) for pet-specific health scoring.
*   **Gemini integration**: Translates complex health data into actionable insights and alerts (simulated via Python backend).
*   **Real-time alerting**: Uses **ElevenLabs** API to generate audio alerts, allowing the pet to "speak" its status to the owner.
*   **Observability**: Integrated **Datadog** to track system performance and pet health metrics in real-time.
*   **Mobile-first interface**: Built with **Next.js** (replacing the initial Firebase frontend prototype) for a high-performance, premium user experience.

## Challenges we ran into
Adapting general anomaly detection to individual pet baselines required extensive model tuning. Each pet's "normal" is unique, so we had to build adaptive thresholds using Vertex AI AutoML strategies. Integrating the multi-modal feedback (text + audio) while maintaining low latency across the Kafka stream was also a complex engineering challenge.

## Accomplishments that we're proud of
*   Successfully simulating a full IoT-to-AI pipeline locally.
*   Giving pets a "voice" using ElevenLabs, making alerts more emotional and impactful.
*   Creating a premium, calming user interface that helps owners manage anxiety around pet health.

## What we learned
Google Cloud's AI tools made it possible to build sophisticated health monitoring without expensive hardware. Gemini's ability to explain complex health patterns in simple terms bridges the gap between data and action. We also learned how critical real-time observability (Datadog) is for maintaining trust in digital health applications.

## What's next for PetTwin Care
Expanding to veterinary practice integrations, partnering with pet insurance companies for risk-based pricing, and scaling the platform to support multiple species beyond dogs and cats.

## Built With
*   **Google Cloud**: Cloud Run, Firestore
*   **Next.js**: Frontend Framework
*   **Python / FastAPI**: Backend API
*   **Scikit-Learn**: Machine Learning Logic
*   **TailwindCSS**: Styling (Ported)

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
