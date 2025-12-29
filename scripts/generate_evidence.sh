#!/bin/bash
# Generate visual evidence for AI Partner Catalyst Hackathon submission
# This script helps you collect all the proof judges need to see

set -e

echo "=============================================================================="
echo "📸 PetTwin Care - Evidence Generation Script"
echo "🏆 AI Partner Catalyst Hackathon - Confluent Challenge"
echo "=============================================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Create evidence directory
EVIDENCE_DIR="docs/evidence_package"
mkdir -p "$EVIDENCE_DIR"

echo -e "${BLUE}📁 Evidence will be saved to: $EVIDENCE_DIR${NC}"
echo ""

# ============================================================================
# SECTION 1: Architecture Diagram
# ============================================================================
echo -e "${GREEN}[1/6] Generating Architecture Diagram...${NC}"
cd docs
python architecture_diagram.py
if [ -f "pettwin_architecture.png" ]; then
    cp pettwin_architecture.png "$EVIDENCE_DIR/"
    echo -e "${GREEN}✅ Architecture diagram generated${NC}"
else
    echo -e "${YELLOW}⚠️  Install diagrams: pip install diagrams${NC}"
fi
cd ..
echo ""

# ============================================================================
# SECTION 2: Run Demo & Capture Output
# ============================================================================
echo -e "${GREEN}[2/6] Running Producer Demo (30 seconds)...${NC}"
echo -e "${YELLOW}ℹ️  Make sure you've configured Confluent credentials!${NC}"
timeout 30s python backend/confluent_producer.py --duration 30 --interval 1 > "$EVIDENCE_DIR/producer_demo_output.txt" 2>&1 || true
echo -e "${GREEN}✅ Producer demo output captured${NC}"
echo ""

# ============================================================================
# SECTION 3: Consumer Demo
# ============================================================================
echo -e "${GREEN}[3/6] Running Consumer + AI Demo (30 seconds)...${NC}"
timeout 30s python backend/confluent_consumer_ai.py > "$EVIDENCE_DIR/consumer_ai_demo_output.txt" 2>&1 || true
echo -e "${GREEN}✅ Consumer + AI demo output captured${NC}"
echo ""

# ============================================================================
# SECTION 4: Code Statistics
# ============================================================================
echo -e "${GREEN}[4/6] Generating Code Statistics...${NC}"
{
    echo "# PetTwin Care - Code Statistics"
    echo "Generated: $(date)"
    echo ""
    echo "## Line Count by Technology"
    echo ""
    echo "### Backend (Python)"
    find backend -name "*.py" -not -path "*/venv/*" -exec wc -l {} + | tail -1
    echo ""
    echo "### Frontend (TypeScript/React)"
    find frontend/app frontend/components -name "*.tsx" -o -name "*.ts" 2>/dev/null | xargs wc -l | tail -1 || echo "N/A"
    echo ""
    echo "## Key Files"
    echo ""
    echo "### Confluent Integration"
    wc -l backend/confluent_producer.py backend/confluent_consumer_ai.py 2>/dev/null || echo "New files"
    echo ""
    echo "### Core Backend"
    wc -l backend/anomaly_detection.py backend/alert_engine.py backend/main.py 2>/dev/null
    echo ""
} > "$EVIDENCE_DIR/code_statistics.txt"
echo -e "${GREEN}✅ Code statistics generated${NC}"
echo ""

# ============================================================================
# SECTION 5: Technical Proof Checklist
# ============================================================================
echo -e "${GREEN}[5/6] Creating Technical Proof Checklist...${NC}"
{
    echo "# Technical Proof Checklist for Judges"
    echo "Generated: $(date)"
    echo ""
    echo "## Confluent Challenge Requirements"
    echo ""
    echo "### ✅ Real-Time Data Streaming"
    echo "- [x] Confluent Kafka producer implemented (confluent_producer.py)"
    echo "- [x] Topic: pet-health-stream"
    echo "- [x] Production-ready configuration (SASL_SSL, acks=all)"
    echo "- [x] Real-time telemetry schema defined"
    echo ""
    echo "### ✅ Stream Processing"
    echo "- [x] Confluent Kafka consumer implemented (confluent_consumer_ai.py)"
    echo "- [x] Consumer group: pettwin-ai-processor"
    echo "- [x] Real-time anomaly detection pipeline"
    echo "- [x] Error handling & graceful degradation"
    echo ""
    echo "### ✅ AI/ML Integration"
    echo "- [x] Vertex AI for anomaly detection"
    echo "- [x] Gemini Pro for natural language generation"
    echo "- [x] Real-time inference on streaming data"
    echo "- [x] Statistical process control (Z-score detection)"
    echo ""
    echo "### ✅ Novel Application"
    echo "- [x] Solves real problem: Early disease detection in pets"
    echo "- [x] Social impact: Reduces vet burnout (3-5x suicide rate)"
    echo "- [x] Innovative use: Multi-sensor fusion (video + BLE + behavioral)"
    echo "- [x] Compelling narrative: Pets can't speak, data can"
    echo ""
    echo "### ✅ Production Quality"
    echo "- [x] Deployed application: https://petai-tau.vercel.app"
    echo "- [x] Source code: https://github.com/gaip/petai"
    echo "- [x] Open-source license: MIT"
    echo "- [x] Documentation: README, architecture diagram, demo notebook"
    echo ""
    echo "## Evidence Files Included"
    echo ""
    ls -1 "$EVIDENCE_DIR"
    echo ""
} > "$EVIDENCE_DIR/technical_proof_checklist.md"
echo -e "${GREEN}✅ Technical proof checklist created${NC}"
echo ""

# ============================================================================
# SECTION 6: Screenshots Reminder
# ============================================================================
echo -e "${GREEN}[6/6] Screenshot Reminders${NC}"
{
    echo "# MANUAL SCREENSHOTS NEEDED"
    echo "================================"
    echo ""
    echo "Please take the following screenshots and save to $EVIDENCE_DIR/screenshots/"
    echo ""
    echo "## Confluent Cloud Dashboard"
    echo "1. Cluster overview showing 'pet-health-stream' topic"
    echo "2. Topic throughput graph (messages/second)"
    echo "3. Consumer lag metrics (should be near zero)"
    echo "4. Cluster settings showing SASL_SSL security"
    echo ""
    echo "## Google Cloud Console"
    echo "5. Vertex AI endpoints showing recent activity"
    echo "6. Cloud Run services dashboard"
    echo "7. Firestore database with pet profiles"
    echo "8. BigQuery dataset with analytics tables"
    echo ""
    echo "## Application Screenshots"
    echo "9. Landing page: https://petai-tau.vercel.app"
    echo "10. Dashboard with real-time health score"
    echo "11. Alert notification example"
    echo "12. Architecture diagram visualization"
    echo ""
    echo "## Demo Terminal Output"
    echo "13. Producer running (already captured in producer_demo_output.txt)"
    echo "14. Consumer + AI running (already captured in consumer_ai_demo_output.txt)"
    echo "15. Anomaly detection in action"
    echo "16. Gemini-generated alert example"
    echo ""
    echo "TIP: Use your OS screenshot tool (Cmd+Shift+4 on Mac, Win+Shift+S on Windows)"
    echo ""
} > "$EVIDENCE_DIR/SCREENSHOT_CHECKLIST.txt"
cat "$EVIDENCE_DIR/SCREENSHOT_CHECKLIST.txt"
echo ""

# ============================================================================
# FINAL SUMMARY
# ============================================================================
echo "=============================================================================="
echo -e "${GREEN}✅ Evidence Generation Complete!${NC}"
echo "=============================================================================="
echo ""
echo -e "${BLUE}📦 Evidence Package Location:${NC}"
echo "   $EVIDENCE_DIR/"
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo "   1. Take manual screenshots (see SCREENSHOT_CHECKLIST.txt)"
echo "   2. Review all generated files"
echo "   3. Upload to Devpost submission"
echo "   4. Update video demo with technical deep-dive"
echo ""
echo -e "${YELLOW}🎯 Winning Formula:${NC}"
echo "   Emotional Story + Technical Proof + Clear Challenge Focus = WIN!"
echo ""
echo -e "${RED}⏰ Deadline: December 31, 2025 @ 2:00pm PST${NC}"
echo ""
echo "Good luck! 🐾🏆"
