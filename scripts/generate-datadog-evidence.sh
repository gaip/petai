#!/bin/bash
# ==========================================
# PetTwin Care - Datadog Evidence Generation Script
# Automated evidence collection for hackathon submission
# ==========================================

set -e

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
EVIDENCE_DIR="docs/screenshots"
TERRAFORM_DIR="terraform/datadog"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "========================================"
echo "🐕 PetTwin Care - Evidence Generation"
echo "========================================"
echo ""

# Create evidence directory
mkdir -p "$EVIDENCE_DIR"

# ==========================================
# 1. Collect Terraform Outputs
# ==========================================

echo -e "${BLUE}📊 Collecting Terraform outputs...${NC}"

cd "$TERRAFORM_DIR"

if [ ! -f "terraform.tfstate" ]; then
    echo -e "${YELLOW}⚠️  No Terraform state found. Please deploy first: bash scripts/deploy-datadog.sh${NC}"
    exit 1
fi

# Export all outputs to JSON
terraform output -json > "../../$EVIDENCE_DIR/terraform-outputs.json"
echo -e "${GREEN}✅ Terraform outputs saved${NC}"

# Extract key URLs
DASHBOARD_URL=$(terraform output -raw dashboard_url 2>/dev/null || echo "N/A")
EXEC_DASHBOARD_URL=$(terraform output -raw executive_dashboard_url 2>/dev/null || echo "N/A")

cd - > /dev/null

# ==========================================
# 2. Generate Evidence Checklist
# ==========================================

echo -e "${BLUE}📋 Generating evidence checklist...${NC}"

cat > "$EVIDENCE_DIR/EVIDENCE_CHECKLIST.md" <<EOF
# PetTwin Care - Datadog Evidence Checklist

**Generated**: $(date)
**Status**: Ready for Screenshot Capture

## 📸 Screenshots Required

### Dashboards

- [ ] **Technical Dashboard** - Main monitoring view
  - URL: $DASHBOARD_URL
  - Requirements: Show all 8 widgets with live data
  - Filename: \`dashboard-technical.png\`

- [ ] **Executive Dashboard** - Business metrics
  - URL: $EXEC_DASHBOARD_URL
  - Requirements: Show SLO status, business KPIs
  - Filename: \`dashboard-executive.png\`

### Monitors

- [ ] **Monitors List** - All 12 monitors
  - URL: https://app.datadoghq.eu/monitors/manage
  - Filter: tag:project:pettwin-care
  - Filename: \`monitors-list.png\`

- [ ] **Monitor Details** - Example alert
  - Show: Vertex AI Latency Anomaly monitor
  - Requirements: Configuration, query, thresholds visible
  - Filename: \`monitor-detail-example.png\`

- [ ] **Alert History** - Triggered alerts
  - Show: Recent alert notifications
  - Requirements: Email/notification examples
  - Filename: \`monitor-alerts-history.png\`

### SLOs

- [ ] **SLO Status Page** - All 5 SLOs
  - URL: https://app.datadoghq.eu/slo/manage
  - Requirements: Show targets, current status, error budgets
  - Filename: \`slos-status.png\`

- [ ] **SLO Detail** - Vertex AI Availability
  - Show: 7d and 30d windows, error budget chart
  - Filename: \`slo-detail-example.png\`

### Metrics

- [ ] **Metrics Explorer** - Custom metrics
  - URL: https://app.datadoghq.eu/metric/explorer
  - Search: \`pettwin.*\`
  - Requirements: Show all custom metrics
  - Filename: \`metrics-explorer.png\`

- [ ] **Metric Detail** - Example metric
  - Show: pettwin.vertex.ai.inference.latency
  - Requirements: Tags, units, description visible
  - Filename: \`metric-detail-example.png\`

### Infrastructure

- [ ] **Container Monitoring** - Docker containers
  - URL: https://app.datadoghq.eu/containers
  - Requirements: Show pettwin containers with metrics
  - Filename: \`infrastructure-containers.png\`

- [ ] **Log Explorer** - Application logs
  - URL: https://app.datadoghq.eu/logs
  - Filter: service:pettwin-care
  - Filename: \`logs-explorer.png\`

### CI/CD

- [ ] **GitHub Actions** - Workflow success
  - URL: https://github.com/gaip/petai/actions
  - Requirements: Show successful datadog-deploy run
  - Filename: \`github-actions-deploy.png\`

- [ ] **GitHub PR** - Validation workflow
  - Requirements: Show PR with plan comment
  - Filename: \`github-pr-validation.png\`

### Configuration

- [ ] **Terraform Files** - IaC evidence
  - Show: VS Code with open Terraform files
  - Requirements: Highlight key resources
  - Filename: \`terraform-code.png\`

- [ ] **Deployment Output** - Terminal
  - Show: Successful terraform apply output
  - Requirements: Resource creation confirmation
  - Filename: \`deployment-terminal.png\`

## 📂 Files to Include

### Code Files
- [x] \`terraform/datadog/main.tf\`
- [x] \`terraform/datadog/monitors.tf\`
- [x] \`terraform/datadog/slos.tf\`
- [x] \`terraform/datadog/dashboard_executive.tf\`
- [x] \`backend/confluent_consumer_ai.py\`
- [x] \`backend/confluent_producer.py\`
- [x] \`docker-compose.yml\`
- [x] \`backend/datadog-agent.yaml\`

### Documentation
- [x] \`docs/DATADOG_IMPLEMENTATION_PLAN.md\`
- [x] \`docs/DATADOG_EVIDENCE_REPORT.md\`
- [x] \`terraform/datadog/README.md\`
- [x] \`backend/DATADOG_AGENT_README.md\`
- [x] \`.github/workflows/README.md\`

### Generated Evidence
- [x] \`terraform-outputs.json\`
- [ ] All screenshots listed above

## 🎯 Capture Instructions

### Before Capturing Screenshots:

1. **Ensure services are running**:
   \`\`\`bash
   docker-compose up -d
   \`\`\`

2. **Generate test data** (wait 2-3 minutes for metrics):
   \`\`\`bash
   # Data will flow automatically from producer/consumer
   \`\`\`

3. **Verify metrics in Datadog**:
   - Check Metrics Explorer for \`pettwin.*\`
   - Confirm dashboard widgets show data
   - Verify monitors are evaluating

### Screenshot Best Practices:

- Use full browser window (1920x1080 recommended)
- Show URL bar to prove authenticity
- Highlight key information
- Use high resolution (retina if available)
- Crop unnecessary UI elements
- Add annotations if helpful

### Tools Recommended:

- **macOS**: Cmd+Shift+4 (area), Cmd+Shift+3 (full screen)
- **Windows**: Snipping Tool, Win+Shift+S
- **Linux**: Flameshot, Shutter
- **Browser**: Full page screenshot extensions

## 📊 Quality Checklist

- [ ] All screenshots are clear and readable
- [ ] URLs are visible in screenshots
- [ ] Timestamps show recency
- [ ] All widgets/components show live data
- [ ] No placeholder or dummy data visible
- [ ] File names match this checklist
- [ ] Screenshots are organized in docs/screenshots/
- [ ] README updated with evidence links

## 📤 Submission Package

Create final submission package:

\`\`\`bash
# Create evidence archive
cd docs
zip -r datadog-evidence-\${TIMESTAMP}.zip \\
    screenshots/ \\
    DATADOG_EVIDENCE_REPORT.md \\
    DATADOG_IMPLEMENTATION_PLAN.md

# Verify package
unzip -l datadog-evidence-\${TIMESTAMP}.zip
\`\`\`

---

**Next Steps**:
1. Complete all screenshot captures
2. Review evidence report: \`docs/DATADOG_EVIDENCE_REPORT.md\`
3. Update main README with evidence links
4. Create submission package
5. Submit to hackathon judges!

EOF

echo -e "${GREEN}✅ Evidence checklist created: $EVIDENCE_DIR/EVIDENCE_CHECKLIST.md${NC}"

# ==========================================
# 3. Generate URLs Document
# ==========================================

echo -e "${BLUE}🔗 Generating URLs document...${NC}"

cat > "$EVIDENCE_DIR/DATADOG_URLS.md" <<EOF
# PetTwin Care - Datadog Resource URLs

**Generated**: $(date)

## 📊 Dashboards

- **Technical Dashboard**: $DASHBOARD_URL
- **Executive Dashboard**: $EXEC_DASHBOARD_URL

## 🔍 Navigation

### Monitors
- **Manage Monitors**: https://app.datadoghq.eu/monitors/manage
- **Filter**: \`tag:project:pettwin-care\`

### SLOs
- **Manage SLOs**: https://app.datadoghq.eu/slo/manage
- **Filter**: \`tag:project:pettwin-care\`

### Metrics
- **Metrics Explorer**: https://app.datadoghq.eu/metric/explorer
- **Search**: \`pettwin.*\`

### Infrastructure
- **Containers**: https://app.datadoghq.eu/containers
- **Filter**: \`image_name:pettwin*\`

### Logs
- **Log Explorer**: https://app.datadoghq.eu/logs
- **Filter**: \`service:pettwin-care\`

### APM (if enabled)
- **APM Services**: https://app.datadoghq.eu/apm/services
- **Service**: pettwin-care

## 🛠️ Admin

- **API Keys**: https://app.datadoghq.eu/organization-settings/api-keys
- **Application Keys**: https://app.datadoghq.eu/organization-settings/application-keys
- **Integrations**: https://app.datadoghq.eu/integrations

## 📚 Documentation

- **Datadog Docs**: https://docs.datadoghq.com/
- **Terraform Provider**: https://registry.terraform.io/providers/DataDog/datadog/latest/docs
- **Project Repo**: https://github.com/gaip/petai

---

**Usage**: Use these URLs to access Datadog resources for screenshot capture and validation.
EOF

echo -e "${GREEN}✅ URLs document created: $EVIDENCE_DIR/DATADOG_URLS.md${NC}"

# ==========================================
# 4. Create Evidence Summary
# ==========================================

echo -e "${BLUE}📝 Creating evidence summary...${NC}"

cat > "$EVIDENCE_DIR/README.md" <<EOF
# Datadog Implementation Evidence

This directory contains evidence of the PetTwin Care Datadog observability implementation for hackathon submission.

## 📁 Contents

- \`EVIDENCE_CHECKLIST.md\` - Complete checklist for screenshot capture
- \`DATADOG_URLS.md\` - All resource URLs for easy access
- \`terraform-outputs.json\` - Terraform deployment outputs
- \`*.png\` - Screenshot evidence (to be added)

## 🎯 Quick Start

1. Review the checklist: \`EVIDENCE_CHECKLIST.md\`
2. Access URLs from: \`DATADOG_URLS.md\`
3. Capture screenshots as specified
4. Review evidence report: \`../DATADOG_EVIDENCE_REPORT.md\`

## 📊 Evidence Status

**Implementation**: ✅ Complete
**Screenshots**: ⏳ Pending (capture using checklist)
**Documentation**: ✅ Complete

## 🔗 Key Resources

- **Technical Dashboard**: $DASHBOARD_URL
- **Executive Dashboard**: $EXEC_DASHBOARD_URL
- **Evidence Report**: \`../DATADOG_EVIDENCE_REPORT.md\`

---

Generated: $(date)
EOF

echo -e "${GREEN}✅ Evidence README created: $EVIDENCE_DIR/README.md${NC}"

# ==========================================
# Summary
# ==========================================

echo ""
echo "========================================"
echo -e "${GREEN}✅ Evidence Generation Complete!${NC}"
echo "========================================"
echo ""
echo "📂 Evidence directory: $EVIDENCE_DIR/"
echo ""
echo "📋 Files created:"
echo "   - EVIDENCE_CHECKLIST.md (screenshot guide)"
echo "   - DATADOG_URLS.md (resource URLs)"
echo "   - terraform-outputs.json (deployment data)"
echo "   - README.md (evidence overview)"
echo ""
echo "🚀 Next Steps:"
echo "   1. Review checklist: cat $EVIDENCE_DIR/EVIDENCE_CHECKLIST.md"
echo "   2. Access dashboards using URLs in DATADOG_URLS.md"
echo "   3. Capture screenshots as specified"
echo "   4. Review final report: docs/DATADOG_EVIDENCE_REPORT.md"
echo ""
echo -e "${BLUE}ℹ️  Technical Dashboard: $DASHBOARD_URL${NC}"
echo -e "${BLUE}ℹ️  Executive Dashboard: $EXEC_DASHBOARD_URL${NC}"
echo ""
