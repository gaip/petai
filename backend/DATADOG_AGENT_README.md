# Datadog Agent Configuration for PetTwin Care

This directory contains the Datadog Agent configuration for comprehensive observability of the PetTwin Care system.

## 📊 What the Agent Monitors

The Datadog Agent collects:

1. **Custom Application Metrics** (via StatsD)
   - Vertex AI inference latency and success rates
   - Kafka consumer lag and throughput
   - Pet health anomaly detection accuracy
   - Real-time pet health vitals (heart rate, activity, gait)

2. **System Metrics**
   - CPU, memory, disk usage
   - Network traffic
   - Process information

3. **Container Metrics**
   - Docker container performance
   - Resource usage per service (backend, frontend, Kafka, Zookeeper)

4. **Logs**
   - All container logs automatically collected
   - Python application logs with proper tagging
   - Kafka and Zookeeper logs

5. **APM Traces** (Application Performance Monitoring)
   - Request tracing through the system
   - Performance bottleneck identification
   - Distributed tracing support

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

```bash
# Run the setup script
bash scripts/setup-datadog-agent.sh
```

The script will:
- ✅ Check prerequisites (Docker, Docker Compose)
- ✅ Validate Datadog credentials
- ✅ Deploy the Datadog Agent
- ✅ Verify metrics collection
- ✅ Display next steps

### Option 2: Manual Setup

```bash
# 1. Configure credentials in .env
cp .env.example .env
vim .env  # Add DD_API_KEY and DD_SITE

# 2. Start the Datadog Agent
docker-compose up -d datadog-agent

# 3. Start backend services
docker-compose up -d backend

# 4. Check agent status
docker exec datadog-agent agent status
```

## 📁 Configuration Files

### `datadog-agent.yaml`
Main agent configuration file. Defines:
- API credentials and site
- DogStatsD configuration for custom metrics
- APM (tracing) settings
- Log collection rules
- Process monitoring
- Security and compliance settings

**Key Settings:**
```yaml
api_key: ${DD_API_KEY}
site: ${DD_SITE:datadoghq.eu}

dogstatsd_config:
  enabled: true
  port: 8125
  namespace: pettwin

apm_config:
  enabled: true
  receiver_port: 8126
```

### `docker-compose.yml`
Docker Compose configuration that:
- Deploys Datadog Agent container
- Exposes StatsD (8125/udp) and APM (8126/tcp) ports
- Mounts Docker socket for container monitoring
- Sets up proper networking between services

## 🔍 Verifying the Setup

### 1. Check Agent Status

```bash
# Full agent status
docker exec datadog-agent agent status

# Check specific components
docker exec datadog-agent agent status | grep -A 5 "DogStatsD"
docker exec datadog-agent agent status | grep -A 5 "Logs Agent"
```

### 2. View Agent Logs

```bash
# Real-time logs
docker logs -f datadog-agent

# Last 100 lines
docker logs --tail 100 datadog-agent
```

### 3. Test Metrics Collection

```bash
# Send a test metric
echo -n "custom.metric.test:1|c" | nc -u -w1 localhost 8125

# Check in Datadog Metrics Explorer
# https://app.datadoghq.eu/metric/explorer?search=custom.metric.test
```

### 4. Verify Backend Connection

```bash
# Start backend and check logs for Datadog initialization
docker-compose up backend

# You should see:
# "✅ Datadog metrics enabled"
```

## 📊 Viewing Your Data

### Datadog Dashboard
Access your pre-configured dashboard:
```
https://app.datadoghq.eu/dashboard/t7g-ubd-aet
```

### Metrics Explorer
Browse all metrics:
```
https://app.datadoghq.eu/metric/explorer
```

Search for `pettwin.*` to see all custom metrics.

### Live Containers
View container performance:
```
https://app.datadoghq.eu/containers
```

### Log Explorer
Search and analyze logs:
```
https://app.datadoghq.eu/logs
```

Filter by: `service:pettwin-care`

## 🔧 Troubleshooting

### Agent Won't Start

```bash
# Check Docker logs
docker logs datadog-agent

# Common issues:
# 1. Invalid API key - verify DD_API_KEY in .env
# 2. Wrong site - check DD_SITE (datadoghq.eu vs .com)
# 3. Port conflicts - ensure 8125 and 8126 are available
```

### No Metrics Showing

```bash
# 1. Verify agent is running
docker ps | grep datadog-agent

# 2. Check agent can receive metrics
docker exec datadog-agent agent status | grep DogStatsD

# 3. Verify backend is sending metrics
docker logs backend | grep "Datadog metrics enabled"

# 4. Check backend can reach agent
docker exec backend ping -c 3 datadog-agent
```

### Backend Can't Connect to Agent

If you see "Datadog library not found" or connection errors:

```bash
# 1. Ensure backend has datadog library
docker exec backend pip list | grep datadog

# 2. Verify network connectivity
docker exec backend nc -zv datadog-agent 8125

# 3. Check environment variables
docker exec backend env | grep DD_
```

### Metrics Not Appearing in Dashboard

1. **Wait 1-2 minutes** - Metrics have a small delay
2. **Check metric names** - Verify `pettwin.*` namespace
3. **Verify time range** - Ensure dashboard shows "Past 1 Hour"
4. **Check dashboard URL** - Ensure you're on the correct dashboard

## 🎯 Testing End-to-End

Run this complete test:

```bash
# 1. Start everything
docker-compose up -d

# 2. Wait 30 seconds for initialization
sleep 30

# 3. Produce test data (if you have producer running)
# This will generate metrics

# 4. Check agent received metrics
docker exec datadog-agent agent status | grep -A 20 "DogStatsD"

# 5. View in Datadog (after 1-2 minutes)
# https://app.datadoghq.eu/metric/explorer?search=pettwin
```

## 🔐 Security Best Practices

1. **Never commit credentials**
   - `.env` is in `.gitignore`
   - Use environment variables in CI/CD

2. **Rotate API keys regularly**
   - Generate new keys monthly
   - Revoke old keys in Datadog UI

3. **Limit permissions**
   - Use separate API keys for dev/prod
   - Restrict key permissions in Datadog

4. **Secure the agent**
   - Run agent as non-root when possible
   - Limit Docker socket access in production
   - Use secrets management (Vault, etc.)

## 📚 Documentation

- **Agent Docs**: https://docs.datadoghq.com/agent/
- **DogStatsD**: https://docs.datadoghq.com/developers/dogstatsd/
- **Docker Integration**: https://docs.datadoghq.com/agent/docker/
- **APM**: https://docs.datadoghq.com/tracing/

## 🎓 Key Concepts

### DogStatsD
- **Protocol**: StatsD with Datadog extensions
- **Port**: 8125/udp
- **Purpose**: Send custom metrics from application code
- **Namespace**: `pettwin.*` for all PetTwin metrics

### APM (Application Performance Monitoring)
- **Port**: 8126/tcp
- **Purpose**: Distributed tracing of requests
- **Service Name**: `pettwin-care`

### Tags
All metrics are tagged with:
- `env:production` (or your DD_ENV value)
- `service:pettwin-care`
- `version:1.0.0`
- `project:pettwin-care`
- `hackathon:google-cloud-ai`

## 💡 Pro Tips

1. **Use the Agent Status Command**
   ```bash
   docker exec datadog-agent agent status
   ```
   This shows everything: metrics, logs, traces, checks

2. **Enable Debug Logging**
   ```bash
   docker exec datadog-agent agent config set log_level debug
   docker restart datadog-agent
   ```

3. **Validate Config Changes**
   ```bash
   docker exec datadog-agent agent configcheck
   ```

4. **Stream Metrics in Real-Time**
   ```bash
   docker exec datadog-agent agent stream-logs
   ```

## 🚀 Next Steps

After confirming the agent is working:

1. **Deploy Terraform Infrastructure**
   ```bash
   cd terraform/datadog
   terraform init
   terraform apply
   ```

2. **Run the Backend Services**
   ```bash
   docker-compose up -d backend
   ```

3. **View Your Dashboard**
   - Open: https://app.datadoghq.eu/dashboard/t7g-ubd-aet
   - Wait 2-3 minutes for metrics to appear
   - Verify all widgets show data

4. **Test Monitors**
   - Trigger an anomaly (send high latency metric)
   - Wait for alert email
   - Verify monitor in Datadog UI

## ✅ Success Criteria

You'll know it's working when:
- ✅ Agent status shows "Running" with no errors
- ✅ DogStatsD shows "UP" in agent status
- ✅ Metrics appear in Datadog within 2 minutes
- ✅ Dashboard widgets populate with data
- ✅ Container metrics visible in Infrastructure view
- ✅ Logs flowing to Log Explorer

---

**Need Help?**
- Check logs: `docker logs datadog-agent`
- Agent status: `docker exec datadog-agent agent status`
- Datadog Support: https://docs.datadoghq.com/help/
