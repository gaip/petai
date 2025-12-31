# PetTwin Care - Datadog Infrastructure as Code

This directory contains Terraform configuration for deploying complete Datadog observability infrastructure for PetTwin Care.

## 🎯 What This Creates

- **2 Dashboards** - Technical + Executive Summary views
- **12 Monitors** - Core alerts + advanced ML-based detection
- **5 SLOs** - Production-grade service level objectives
- **Production-Ready** - Enterprise-level observability infrastructure

## 📋 Prerequisites

1. **Terraform** installed (>= 1.0)
   ```bash
   brew install terraform  # macOS
   # or
   wget https://releases.hashicorp.com/terraform/1.6.0/terraform_1.6.0_linux_amd64.zip
   ```

2. **Datadog Account** with API access
   - Get API Key: https://app.datadoghq.com/organization-settings/api-keys
   - Get APP Key: https://app.datadoghq.com/organization-settings/application-keys

## 🚀 Quick Start

### 1. Configure Credentials

```bash
# Copy example configuration
cp terraform.tfvars.example terraform.tfvars

# Edit with your credentials
vim terraform.tfvars
```

**Required variables:**
```hcl
datadog_api_key = "YOUR_DATADOG_API_KEY"
datadog_app_key = "YOUR_DATADOG_APP_KEY"
datadog_api_url = "https://api.datadoghq.eu/api/v1"  # or .com for US
alert_email     = "your-email@example.com"
```

### 2. Deploy Infrastructure

```bash
# Initialize Terraform
terraform init

# Preview changes
terraform plan

# Deploy (creates all resources)
terraform apply
```

### 3. Access Your Dashboard

```bash
# Get dashboard URL
terraform output dashboard_url

# Get all monitor URLs
terraform output monitor_urls
```

## 📊 Resources Created

### Dashboards

#### 1. Technical Dashboard (Main)
- **8 Widgets** covering AI, Kafka, and health metrics
- Real-time anomaly detection visualization
- Performance distribution charts
- Error rate tracking

#### 2. Executive Dashboard
- **High-level business metrics**
- SLO status and error budget tracking
- System availability overview
- Cost efficiency analysis

### Monitors

#### Core Monitors (6)
1. **Vertex AI Latency Anomaly** - ML-based anomaly detection
2. **Detection Accuracy Low** - Accuracy < 90% alert
3. **Kafka Consumer Lag** - Lag > 5000ms alert
4. **High Error Rate** - Error rate > 10% alert
5. **No Data Received** - Stream stopped alert
6. **Heart Rate Abnormal** - Pet health alert

#### Advanced Monitors (6)
7. **System Critical Composite** - Multi-component failure detection
8. **Kafka Throughput Forecast** - Predictive capacity planning
9. **Pet Activity Anomaly** - ML-based behavioral pattern detection
10. **Vertex AI Latency Outlier** - Statistical outlier detection
11. **SLO Burn Rate Alert** - Fast error budget consumption
12. **Regional Health Check** - Multi-region performance monitoring

### Service Level Objectives (5)

1. **Vertex AI Availability** - 99.5% uptime target (7d & 30d)
2. **AI Inference Latency** - P95 < 2000ms performance target
3. **Anomaly Detection Accuracy** - > 90% accuracy requirement
4. **Kafka Consumer Health** - < 5000ms lag target
5. **Overall System Health** - Composite 99% availability

## 🔧 Configuration

### Environment Variables

Alternatively, use environment variables (more secure):

```bash
export TF_VAR_datadog_api_key="your-api-key"
export TF_VAR_datadog_app_key="your-app-key"
export TF_VAR_alert_email="your-email@example.com"

terraform apply
```

### Customization

Edit `terraform.tfvars` to customize:

```hcl
# Change alert thresholds
accuracy_critical_threshold = 85.0
consumer_lag_critical_ms    = 5000
error_rate_critical_percent = 10.0

# Change environment
environment = "production"  # or "staging", "development"

# Change notification interval
alert_renotify_interval = 60  # minutes
```

## 📋 Common Commands

```bash
# View current state
terraform show

# List all resources
terraform state list

# Get outputs
terraform output
terraform output dashboard_url
terraform output -json > outputs.json

# Update infrastructure
terraform apply

# Destroy all resources (careful!)
terraform destroy

# Format code
terraform fmt

# Validate configuration
terraform validate
```

## 🔍 Metrics Reference

All metrics use namespace `pettwin.*`:

**AI Performance:**
- `pettwin.vertex.ai.inference.latency` - Gemini API latency (ms)
- `pettwin.vertex.ai.inference.success` - Successful calls (count)
- `pettwin.vertex.ai.inference.error` - Failed calls (count)

**Anomaly Detection:**
- `pettwin.pet.health.anomaly.accuracy` - Detection accuracy (%)
- `pettwin.pet.health.anomaly.detected` - Anomalies found (count)

**Kafka:**
- `pettwin.kafka.consumer.lag` - Consumer lag (ms)
- `pettwin.kafka.messages.consumed` - Messages consumed (count)
- `pettwin.kafka.messages.produced` - Messages produced (count)

**Pet Health:**
- `pettwin.pet.health.heart_rate` - Heart rate (bpm)
- `pettwin.pet.health.activity_score` - Activity level (0-100)
- `pettwin.pet.health.gait_symmetry` - Gait quality (0-1)

## 🔒 Security

**Never commit sensitive files:**
- `terraform.tfvars` - Contains API keys
- `*.tfstate` - Contains state with sensitive data
- `.terraform/` - Terraform cache directory

These are already in `.gitignore`.

**Best Practices:**
1. Use environment variables for credentials
2. Store state remotely (S3, Terraform Cloud)
3. Enable state locking
4. Use separate workspaces for environments

## 🆘 Troubleshooting

### "Error: authentication error"
- Verify API keys are correct
- Check API URL matches your region (.com vs .eu)
- Ensure keys have necessary permissions

### "Error: resource already exists"
- Import existing resource: `terraform import datadog_dashboard.pettwin_main <dashboard-id>`
- Or destroy and recreate: `terraform destroy && terraform apply`

### "No data in dashboard"
- Ensure backend is sending metrics (see `backend/confluent_consumer_ai.py`)
- Check Datadog agent is running: `datadog-agent status`
- Verify metrics in Metrics Explorer: https://app.datadoghq.com/metric/explorer

## 📚 Documentation

- **Datadog Provider**: https://registry.terraform.io/providers/DataDog/datadog/latest/docs
- **Implementation Guide**: `../../docs/DATADOG_IMPLEMENTATION.md`
- **Backend Metrics**: `../../backend/confluent_consumer_ai.py`

## 🚀 CI/CD Integration

See `.github/workflows/datadog-deploy.yml` for automated deployment.

## 📞 Support

For issues or questions:
- Implementation docs: `docs/DATADOG_IMPLEMENTATION.md`
- GitHub Issues: https://github.com/gaip/petai/issues
- Datadog Support: https://docs.datadoghq.com/

---

**Built with ❤️ for PetTwin Care Hackathon Submission**
