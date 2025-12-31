#!/bin/bash
# 🎬 PetTwin Care - One-Click Demo Script

echo "🐾 Starting PetTwin Care System..."

# 1. Start Telemetry Producer (Simulating IoT Devices)
echo "📡 Starting IoT Telemetry Producer..."
cd backend
source venv/bin/activate
# Run producer in background, logging to file
python confluent_producer.py > producer.log 2>&1 &
PRODUCER_PID=$!
echo "   ✅ Producer active (PID: $PRODUCER_PID)"

# 2. Start AI Consumer (The Brain)
echo "🧠 Starting Vertex AI Consumer..."
# Run consumer in background, logging to file
python confluent_consumer_ai.py > consumer.log 2>&1 &
CONSUMER_PID=$!
echo "   ✅ AI Brain active (PID: $CONSUMER_PID)"

# 3. Start Frontend (The Face)
echo "💻 Starting Dashboard UI..."
cd ../frontend
npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!
echo "   ✅ Frontend active (PID: $FRONTEND_PID)"

# 4. Wait for services to warm up
echo "⏳ Warming up services (5s)..."
sleep 5

# 5. Open Browser
echo "🌍 Opening Dashboard..."
open "http://localhost:3000/dashboard"

echo "==================================================="
echo "🎥 SYSTEM LIVE! READY FOR RECORDING."
echo "==================================================="
echo "📝 Logs available in: backend/producer.log, backend/consumer.log, frontend/frontend.log"
echo "❌ To Stop: Press CTRL+C (This will kill all background processes)"

# Cleanup trap
trap "kill $PRODUCER_PID $CONSUMER_PID $FRONTEND_PID; exit" INT

# Keep script running to maintain logs/trap
wait
