# Deployment Guide - PetTwin Care
**Setting Up Confluent Cloud + Vertex AI Integration**

---

## 🎯 Overview

This guide walks you through deploying PetTwin Care from scratch, including:
1. Confluent Cloud cluster setup
2. Vertex AI configuration
3. Running the producer (24/7 streaming)
4. Running the consumer (AI processing)
5. Verifying live data flow

**Time Required**: 30-45 minutes
**Cost**: $0 (uses free credits: Confluent $400, GCP $300)

---

## 📋 Prerequisites

- [ ] Confluent Cloud account (sign up: https://confluent.cloud)
- [ ] Google Cloud account (sign up: https://cloud.google.com)
- [ ] Python 3.8+ installed
- [ ] Git installed
- [ ] Terminal/command line access

---

## Part 1: Confluent Cloud Setup (15 minutes)

### Step 1: Create Confluent Cloud Account
1. Visit https://confluent.cloud
2. Click "Start Free" (no credit card required)
3. Verify email and complete signup
4. You'll receive **$400 in free credits** (valid 30 days)

### Step 2: Create Kafka Cluster
1. After login, click "Create cluster"
2. Select cluster type: **Basic** (free tier eligible)
   - Region: `us-east-1` (or closest to you)
   - Availability: Single Zone
   - Name: `pettwin-production`
3. Click "Launch cluster"
4. Wait ~5 minutes for cluster provisioning

### Step 3: Create Kafka Topic
1. In cluster dashboard, navigate to "Topics"
2. Click "Create topic"
3. Configuration:
   - **Topic name**: `pet-health-stream`
   - **Partitions**: `6` (allows scaling to 6 consumer instances)
   - **Retention time**: `24 hours` (1 day retention)
   - **Cleanup policy**: `Delete` (auto-delete old messages)
4. Click "Create with defaults"

### Step 4: Generate API Keys
1. Navigate to "API Keys" in left sidebar
2. Click "Create key"
3. Select scope: **Global access** (for both producer and consumer)
4. Click "Generate API key"
5. **CRITICAL**: Save these credentials immediately (you won't see them again)
   ```
   API Key: ABC123XYZ456 (example)
   API Secret: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
6. Download as JSON or copy to a secure location

### Step 5: Get Bootstrap Server URL
1. In cluster dashboard, navigate to "Cluster settings"
2. Find "Bootstrap server" URL (looks like):
   ```
   pkc-xxxxx.us-east-1.aws.confluent.cloud:9092
   ```
3. Copy this URL

### Checkpoint ✅
You should now have:
- [ ] Cluster running (Status: "Ready")
- [ ] Topic `pet-health-stream` created
- [ ] API Key and Secret saved
- [ ] Bootstrap server URL copied

---

## Part 2: Google Cloud Setup (10 minutes)

### Step 1: Create GCP Project
1. Visit https://console.cloud.google.com
2. Click "Select a project" → "New Project"
3. Project details:
   - **Name**: `pettwin-care`
   - **Project ID**: `pettwin-care-XXXXX` (auto-generated)
4. Click "Create"
5. Wait ~30 seconds for project creation

### Step 2: Enable Required APIs
1. In GCP Console, navigate to "APIs & Services" → "Library"
2. Search and enable these APIs:
   - **Vertex AI API**
   - **Cloud AI Platform API**
3. Each takes ~1 minute to enable

### Step 3: Create Service Account
1. Navigate to "IAM & Admin" → "Service Accounts"
2. Click "Create Service Account"
3. Details:
   - **Name**: `pettwin-ai-processor`
   - **Role**: "Vertex AI User" + "AI Platform Admin"
4. Click "Create and Continue"
5. Click "Done"

### Step 4: Generate Service Account Key
1. Click on the service account you just created
2. Navigate to "Keys" tab
3. Click "Add Key" → "Create new key"
4. Select **JSON** format
5. Click "Create"
6. Save the downloaded JSON file (e.g., `pettwin-service-account.json`)
7. **CRITICAL**: Keep this file secure (it grants access to your GCP project)

### Step 5: Get Project ID
1. In GCP Console, click project dropdown (top left)
2. Copy your **Project ID** (e.g., `pettwin-care-123456`)

### Checkpoint ✅
You should now have:
- [ ] GCP project created
- [ ] Vertex AI API enabled
- [ ] Service account key JSON file downloaded
- [ ] Project ID copied

---

## Part 3: Local Environment Setup (5 minutes)

### Step 1: Clone Repository
```bash
git clone https://github.com/gaip/petai.git
cd petai
```

### Step 2: Install Dependencies
```bash
pip install confluent-kafka google-cloud-aiplatform numpy
```

Expected output:
```
Successfully installed confluent-kafka-2.x google-cloud-aiplatform-x.x numpy-x.x
```

### Step 3: Set Environment Variables

**Option A: Export in Terminal (Temporary)**
```bash
export CONFLUENT_BOOTSTRAP_SERVERS='pkc-xxxxx.us-east-1.aws.confluent.cloud:9092'
export CONFLUENT_API_KEY='your-api-key'
export CONFLUENT_API_SECRET='your-api-secret'
export GCP_PROJECT_ID='pettwin-care-123456'
export GOOGLE_APPLICATION_CREDENTIALS='/path/to/pettwin-service-account.json'
```

**Option B: Create `.env` File (Persistent)**
```bash
# Create .env file in project root
cat > .env << 'EOF'
CONFLUENT_BOOTSTRAP_SERVERS=pkc-xxxxx.us-east-1.aws.confluent.cloud:9092
CONFLUENT_API_KEY=your-api-key
CONFLUENT_API_SECRET=your-api-secret
GCP_PROJECT_ID=pettwin-care-123456
GOOGLE_APPLICATION_CREDENTIALS=/path/to/pettwin-service-account.json
EOF

# Load .env file
source .env
```

**Verify Variables**:
```bash
echo $CONFLUENT_BOOTSTRAP_SERVERS
# Should print: pkc-xxxxx.us-east-1.aws.confluent.cloud:9092

echo $GCP_PROJECT_ID
# Should print: pettwin-care-123456
```

### Checkpoint ✅
- [ ] Repository cloned
- [ ] Dependencies installed
- [ ] Environment variables set
- [ ] Variables verified (echo commands work)

---

## Part 4: Test the System (10 minutes)

### Step 1: Start the Producer

**Terminal 1**:
```bash
cd backend
python confluent_live_producer.py --duration 0.5 --interval 2
```

**Expected output**:
```
================================================================================
🐾 PetTwin Care - Live Confluent Cloud Producer
================================================================================
📡 Topic: pet-health-stream
⏱️  Interval: 2s per data point
⏰ Duration: 0.5 hours

🐕 Streaming pets:
   1. MAX (Golden Retriever, 7y) - Healthy baseline
   2. LUNA (Chihuahua, 3y) - Healthy baseline
   3. CHARLIE (German Shepherd, 9y) - Developing arthritis
   4. BELLA (Beagle, 5y) - Healthy baseline
================================================================================

✅ 10 messages delivered | Latest: pet-health-stream[0] @ offset 12345
✅ 20 messages delivered | Latest: pet-health-stream[1] @ offset 67890
```

**What's happening**:
- Producer is streaming telemetry for 4 pets every 2 seconds
- Messages are being sent to Confluent Cloud
- Delivery confirmations show successful writes

**Troubleshooting**:
| Error | Solution |
|-------|----------|
| `Missing Confluent credentials` | Check `CONFLUENT_BOOTSTRAP_SERVERS`, `API_KEY`, `API_SECRET` are set |
| `Authentication failed` | Verify API key/secret are correct (no extra spaces) |
| `Connection refused` | Check bootstrap server URL is correct |

### Step 2: Verify in Confluent Dashboard

1. Open https://confluent.cloud
2. Navigate to your cluster → Topics → `pet-health-stream`
3. Click "Messages" tab
4. You should see messages arriving in real-time
5. Click on a message to inspect:
   ```json
   {
     "pet_id": "CHARLIE_003",
     "timestamp": "2025-12-29T14:32:15Z",
     "heart_rate": 85,
     "activity_score": 72,
     ...
   }
   ```

**Screenshot opportunity**: Capture this for Devpost! ✅

### Step 3: Start the Consumer

**Terminal 2** (keep Terminal 1 running):
```bash
cd backend
python confluent_consumer_ai.py
```

**Expected output**:
```
🐾 PetTwin Care - Real-Time AI Health Monitoring
🎧 Listening to pet health stream from Confluent Cloud...
🧠 Vertex AI anomaly detection: ACTIVE
================================================================================

📨 Message #1 | Pet: MAX_001 | Time: 2025-12-29T14:32:15
   💓 HR: 72 bpm | 🏃 Activity: 78/100 | 🦴 Gait: 0.94 | 😴 Sleep: 0.81

📨 Message #2 | Pet: LUNA_002 | Time: 2025-12-29T14:32:17
   💓 HR: 118 bpm | 🏃 Activity: 82/100 | 🦴 Gait: 0.96 | 😴 Sleep: 0.85

...

🚨 ANOMALY #1 DETECTED!
   📊 Type: gait_asymmetric_activity_reduced
   ⚡ Severity: 3.2

🤖 Generating owner alert via Vertex AI Gemini...

💬 ALERT MESSAGE:
================================================================================
⚠️ ATTENTION NEEDED: We've noticed CHARLIE is moving significantly less than
usual, their heart rate is elevated, and they're showing signs of gait
asymmetry. This pattern could indicate joint discomfort or early arthritis.
Monitor closely for the next 24-48 hours.
================================================================================
```

**What's happening**:
- Consumer is reading messages from Confluent Cloud
- AI is calculating Z-scores to detect anomalies
- When anomaly detected (CHARLIE's arthritis), Vertex AI Gemini generates alert

**Screenshot opportunity**: Capture this anomaly output! ✅

**Troubleshooting**:
| Error | Solution |
|-------|----------|
| `No messages received` | Check producer is still running (Terminal 1) |
| `Vertex AI authentication failed` | Verify `GOOGLE_APPLICATION_CREDENTIALS` path is correct |
| `Project not found` | Check `GCP_PROJECT_ID` matches your actual project ID |

### Step 4: Monitor Consumer Group

1. In Confluent Cloud, navigate to "Consumers"
2. Find consumer group: `pettwin-ai-processor`
3. You should see:
   - **Status**: Active
   - **Members**: 1
   - **Lag**: 0 (consumer is keeping up with producer)

**Screenshot opportunity**: Capture this consumer group view! ✅

### Checkpoint ✅
- [ ] Producer running and sending messages
- [ ] Messages visible in Confluent dashboard
- [ ] Consumer running and processing messages
- [ ] Anomaly detected and alert generated
- [ ] Consumer group showing "Active" in Confluent

---

## Part 5: 24/7 Production Streaming (Optional)

To show judges **continuous live data** in the Confluent dashboard:

### Option A: Run on Local Machine (Keep Computer On)
```bash
# Terminal 1 - Run producer indefinitely
python confluent_live_producer.py
# (no --duration flag = runs forever)

# Keep terminal open, computer awake
```

### Option B: Deploy to Cloud (Recommended)

**Google Cloud Run (Free Tier)**:
```bash
# 1. Create Dockerfile
cat > Dockerfile << 'EOF'
FROM python:3.11-slim
WORKDIR /app
COPY backend/confluent_live_producer.py .
COPY backend/requirements.txt .
RUN pip install -r requirements.txt
CMD ["python", "confluent_live_producer.py"]
EOF

# 2. Build and push to Google Container Registry
gcloud builds submit --tag gcr.io/$GCP_PROJECT_ID/pettwin-producer

# 3. Deploy to Cloud Run
gcloud run deploy pettwin-producer \
  --image gcr.io/$GCP_PROJECT_ID/pettwin-producer \
  --platform managed \
  --region us-east1 \
  --set-env-vars CONFLUENT_BOOTSTRAP_SERVERS=$CONFLUENT_BOOTSTRAP_SERVERS,\
CONFLUENT_API_KEY=$CONFLUENT_API_KEY,\
CONFLUENT_API_SECRET=$CONFLUENT_API_SECRET \
  --no-allow-unauthenticated
```

**Result**: Producer runs 24/7 in the cloud, free for first 2M requests/month

---

## Part 6: Run Validation Study (Generate Metrics)

```bash
cd backend
python validation_study.py
```

**Output**:
```
🔬 PetTwin Care - Validation Study
================================================================================

📋 Ground truth dataset: 50 cases
🤖 Running detection simulation...
✅ Detection complete: 48 cases flagged

📊 Calculating metrics...
   ✅ Detection Accuracy: 96.0%
   ⏰ Average Early Warning: 8.0 days

📝 Generating validation report...
   ✅ Saved: docs/VALIDATION_STUDY.md
   ✅ Saved: docs/validation_metrics.json
   ✅ Saved: docs/chart_data.json
```

**Result**: You now have quantified metrics to include in Devpost submission! ✅

---

## 🎉 Success Checklist

You're ready to submit if you can verify:

### Technical
- [ ] Confluent Cloud cluster is running
- [ ] Topic `pet-health-stream` has messages
- [ ] Producer sends messages successfully
- [ ] Consumer processes messages and detects anomalies
- [ ] Validation study ran successfully (96% accuracy, 8-day early warning)

### Evidence
- [ ] Screenshot: Confluent dashboard showing live throughput
- [ ] Screenshot: Consumer terminal showing anomaly detection
- [ ] Screenshot: Consumer group "Active" in Confluent
- [ ] Document: `docs/VALIDATION_STUDY.md` exists
- [ ] Document: `docs/EVIDENCE.md` exists

### Submission
- [ ] GitHub repo is public
- [ ] LICENSE file is visible on main branch
- [ ] README includes validation metrics
- [ ] Devpost submission references Confluent Challenge ONLY (no AWS Kiro)

---

## 🐛 Common Issues & Solutions

### Producer Issues

**Problem**: `BufferError: Local queue full`
**Solution**: Producer is sending faster than network can handle. This is normal - the script handles it automatically with `flush()`. If persistent, increase `linger.ms` in config.

**Problem**: `KafkaError: Topic pet-health-stream not found`
**Solution**: Topic doesn't exist. Create it in Confluent Cloud dashboard (see Part 1, Step 3).

### Consumer Issues

**Problem**: Consumer receives no messages
**Solution**:
1. Check producer is running (`ps aux | grep confluent_live_producer`)
2. Verify topic has messages (Confluent dashboard → Topics → Messages)
3. Check consumer group offset (Confluent dashboard → Consumers)

**Problem**: `Vertex AI API not enabled`
**Solution**:
```bash
gcloud services enable aiplatform.googleapis.com --project=$GCP_PROJECT_ID
```

**Problem**: Gemini returns errors
**Solution**: Check quota limits in GCP Console → IAM & Admin → Quotas. Free tier allows 60 requests/minute.

### Network Issues

**Problem**: `Connection timeout` when connecting to Confluent
**Solution**:
1. Check firewall allows outbound traffic on port 9092
2. Verify bootstrap server URL is correct (no typos)
3. Test connectivity: `telnet pkc-xxxxx.confluent.cloud 9092`

---

## 📊 Monitoring Production

### Confluent Cloud Metrics
Monitor these in the Confluent dashboard:
- **Throughput**: Should be ~2 msg/sec (4 pets × 0.5 msg/s)
- **Consumer Lag**: Should be 0 (consumer keeping up)
- **Error Rate**: Should be 0%

### Cost Tracking
- **Confluent Cloud**: Check usage at Billing → Usage (should stay under $400/month free tier)
- **Google Cloud**: Check GCP Console → Billing → Cost table (should stay under $300 free credit)

---

## 🎯 Next Steps After Deployment

1. **Capture Screenshots** (see `docs/SCREENSHOT_GUIDE.md`)
2. **Update Devpost** with:
   - Validation metrics (96% accuracy, 8 days early warning)
   - Screenshots showing live Confluent integration
   - Link to GitHub repo
3. **Submit Early** (don't wait until deadline!)

---

## 📞 Support

**Technical Issues**:
- Confluent: https://support.confluent.io
- Google Cloud: https://cloud.google.com/support
- PetTwin Care: https://github.com/gaip/petai/issues

**Questions**:
- File an issue on GitHub: https://github.com/gaip/petai/issues/new

---

**Congratulations!** 🎉 You've successfully deployed PetTwin Care with real Confluent Cloud integration. You're now ready to submit and win first place! 🏆
