# ==========================================
# PetTwin Care - Datadog Monitors
# Anomaly detection and alerting rules
# ==========================================

# Monitor 1: Vertex AI Gemini Latency Anomaly Detection
resource "datadog_monitor" "vertex_ai_latency_anomaly" {
  name    = "PetTwin Care - Vertex AI Gemini Latency Anomaly Detection"
  type    = "query alert"
  message = <<-EOT
    🚨 **PetTwin Care - Vertex AI Anomaly Detected!**

    **AI Inference Latency has deviated from expected pattern.**

    **Current Status:**
    - Metric: {{metric.name}}
    - Current Value: {{value}} ms
    - Threshold: {{threshold}} ms
    - Duration: {{last_triggered_at}}

    **Potential Impact:**
    This may indicate:
    - High Gemini API load
    - Model performance degradation
    - Network connectivity issues
    - Potential system issues affecting pet health diagnostics

    **Action Required:**
    1. Check Vertex AI dashboard: https://console.cloud.google.com/vertex-ai
    2. Review Gemini API quotas and rate limits
    3. Investigate Kafka consumer lag
    4. Verify Confluent Cloud streaming health
    5. Ensure real-time pet health alerts are functioning

    **Resources:**
    - Dashboard: ${var.dashboard_url}
    - Runbook: https://github.com/gaip/petai/blob/main/docs/DATADOG_IMPLEMENTATION.md
    - Escalation: @oncall-engineering

    @${var.alert_email}
  EOT

  query = "avg(last_15m):anomalies(avg:pettwin.vertex.ai.inference.latency{model:gemini-pro}, 'basic', 2, direction='both', interval=60, alert_window='last_15m', count_default_zero='true') >= 1"

  monitor_thresholds {
    critical          = 1.0
    critical_recovery = 0.0
  }

  notify_no_data    = true
  no_data_timeframe = 30
  renotify_interval = 60

  notify_audit = false
  timeout_h    = 0
  include_tags = true

  tags = concat(local.common_tags, [
    "service:vertex-ai",
    "alert:latency",
    "severity:high"
  ])
}

# Monitor 2: Anomaly Detection Accuracy Degradation
resource "datadog_monitor" "anomaly_accuracy_low" {
  name    = "PetTwin Care - Detection Accuracy Below Threshold"
  type    = "metric alert"
  message = <<-EOT
    ⚠️ **PetTwin Care - Anomaly Detection Accuracy Degraded!**

    **Detection accuracy has dropped below acceptable threshold.**

    **Details:**
    - Current Accuracy: {{value}}%
    - Expected: >90%
    - Validated Performance: 92%

    **Potential Causes:**
    - Model drift
    - Data quality issues
    - Baseline recalibration needed
    - System malfunction

    **Immediate Actions:**
    1. Review recent detection results
    2. Check data ingestion quality
    3. Verify Kafka message integrity
    4. Inspect Vertex AI model performance
    5. Consider baseline reset

    **Resources:**
    - Validation Study: https://github.com/gaip/petai/blob/main/docs/VALIDATION_STUDY.md
    - Methodology: https://github.com/gaip/petai/blob/main/docs/METHODOLOGY.md

    @${var.alert_email}
  EOT

  query = "avg(last_1h):avg:pettwin.pet.health.anomaly.accuracy{*} < 90"

  monitor_thresholds {
    critical = 85.0
    warning  = 90.0
  }

  notify_no_data    = true
  no_data_timeframe = 60
  renotify_interval = 120

  tags = concat(local.common_tags, [
    "service:anomaly-detection",
    "alert:accuracy",
    "severity:critical"
  ])
}

# Monitor 3: Kafka Consumer Lag Critical
resource "datadog_monitor" "kafka_consumer_lag" {
  name    = "PetTwin Care - Kafka Consumer Lag Critical"
  type    = "metric alert"
  message = <<-EOT
    🚨 **PetTwin Care - Kafka Consumer Lag Critical!**

    **Consumer is falling behind message production.**

    **Details:**
    - Current Lag: {{value}} ms
    - Threshold: {{threshold}} ms
    - Topic: pet-health-stream

    **Impact:**
    - Real-time health alerts delayed
    - Anomaly detection latency increased
    - User experience degraded

    **Actions:**
    1. Check consumer service health
    2. Review Vertex AI processing time
    3. Verify network connectivity to Confluent Cloud
    4. Scale consumer instances if needed
    5. Check for processing errors

    **Resources:**
    - Confluent Dashboard: https://confluent.cloud
    - Backend Logs: Check Cloud Run logs

    @${var.alert_email}
  EOT

  query = "avg(last_5m):avg:pettwin.kafka.consumer.lag{topic:pet-health-stream} > 5000"

  monitor_thresholds {
    critical = 5000.0
    warning  = 1000.0
  }

  notify_no_data    = true
  no_data_timeframe = 10

  tags = concat(local.common_tags, [
    "service:kafka",
    "alert:consumer-lag",
    "severity:high"
  ])
}

# Monitor 4: High Error Rate
resource "datadog_monitor" "high_error_rate" {
  name    = "PetTwin Care - High Error Rate Detected"
  type    = "metric alert"
  message = <<-EOT
    ⚠️ **PetTwin Care - High Error Rate!**

    **System experiencing elevated error rate.**

    **Details:**
    - Error Rate: {{value}}%
    - Threshold: {{threshold}}%

    **Potential Sources:**
    - Vertex AI API errors
    - Kafka connection issues
    - Data parsing failures
    - Network problems

    **Actions:**
    1. Check error logs in Cloud Run
    2. Verify Vertex AI API status
    3. Check Confluent Cloud status
    4. Review recent deployments
    5. Inspect error types and patterns

    @${var.alert_email}
  EOT

  query = "sum(last_5m):sum:pettwin.vertex.ai.inference.error{*}.as_rate() / (sum:pettwin.vertex.ai.inference.success{*}.as_rate() + sum:pettwin.vertex.ai.inference.error{*}.as_rate()) * 100 > 10"

  monitor_thresholds {
    critical = 10.0
    warning  = 5.0
  }

  tags = concat(local.common_tags, [
    "service:vertex-ai",
    "alert:error-rate",
    "severity:medium"
  ])
}

# Monitor 5: No Data Received
resource "datadog_monitor" "no_data_received" {
  name    = "PetTwin Care - No Data Received from Kafka"
  type    = "metric alert"
  message = <<-EOT
    🚨 **PetTwin Care - Data Stream Stopped!**

    **No messages received from Kafka in the last 5 minutes.**

    **Potential Causes:**
    - Producer service down
    - Confluent Cloud connectivity issue
    - Network problems
    - API key/credentials expired

    **Immediate Actions:**
    1. Check producer service status
    2. Verify Confluent Cloud cluster health
    3. Test Kafka connectivity
    4. Review API credentials
    5. Check Cloud Run deployment status

    **Impact:** Real-time pet health monitoring is offline!

    @${var.alert_email}
  EOT

  query = "sum(last_5m):sum:pettwin.kafka.messages.consumed{*}.as_count() < 1"

  monitor_thresholds {
    critical = 1.0
  }

  notify_no_data    = true
  no_data_timeframe = 5

  tags = concat(local.common_tags, [
    "service:kafka",
    "alert:data-stream",
    "severity:critical"
  ])
}

# Monitor 6: Pet Heart Rate Abnormal
resource "datadog_monitor" "heart_rate_abnormal" {
  name    = "PetTwin Care - Pet Heart Rate Abnormal"
  type    = "metric alert"
  message = <<-EOT
    ⚠️ **Pet Health Alert - Abnormal Heart Rate!**

    **Pet {{pet.name}} has abnormal heart rate.**

    **Details:**
    - Current Heart Rate: {{value}} bpm
    - Normal Range: 60-120 bpm
    - Pet: {{pet.name}}

    **This is an automated health alert for demonstration purposes.**

    @${var.alert_email}
  EOT

  query = "avg(last_5m):avg:pettwin.pet.health.heart_rate{*} by {pet} > 120 or avg(last_5m):avg:pettwin.pet.health.heart_rate{*} by {pet} < 60"

  monitor_thresholds {
    critical = 120.0
  }

  tags = concat(local.common_tags, [
    "service:health-monitoring",
    "alert:vitals",
    "severity:medium"
  ])
}

# ==========================================
# Advanced Monitors
# ==========================================

# Monitor 7: Composite Monitor - System Critical Failure
resource "datadog_monitor" "system_critical_composite" {
  name    = "PetTwin Care - Critical System Failure (Composite)"
  type    = "composite"
  message = <<-EOT
    🚨🚨🚨 **CRITICAL: PetTwin Care System Failure!** 🚨🚨🚨

    **Multiple critical components are failing simultaneously.**

    **This indicates a severe system issue requiring immediate attention.**

    **Affected Components:**
    - Vertex AI Latency: {{#is_alert "vertex_ai_latency_anomaly"}}FAILING{{/is_alert}}
    - Detection Accuracy: {{#is_alert "anomaly_accuracy_low"}}FAILING{{/is_alert}}
    - Kafka Consumer: {{#is_alert "kafka_consumer_lag"}}FAILING{{/is_alert}}

    **Business Impact:**
    - ❌ Real-time pet health monitoring unavailable
    - ❌ AI-powered diagnostics degraded or offline
    - ❌ Pet owners not receiving critical health alerts

    **Escalation Protocol:**
    1. Page on-call engineer immediately
    2. Activate incident response team
    3. Check Google Cloud status page
    4. Review Confluent Cloud status
    5. Investigate recent deployments

    **Incident Response:**
    - Slack Channel: #pettwin-incidents
    - PagerDuty: Critical Alert
    - Zoom Bridge: pettwin.zoom.us/emergency

    @${var.alert_email}
    @pagerduty-critical
  EOT

  # Composite query: Alert if 2 or more monitors are in alert state
  query = "(${datadog_monitor.vertex_ai_latency_anomaly.id} && ${datadog_monitor.anomaly_accuracy_low.id}) || (${datadog_monitor.vertex_ai_latency_anomaly.id} && ${datadog_monitor.kafka_consumer_lag.id}) || (${datadog_monitor.anomaly_accuracy_low.id} && ${datadog_monitor.kafka_consumer_lag.id})"

  tags = concat(local.common_tags, [
    "service:pettwin-care",
    "alert:composite",
    "severity:critical",
    "escalation:immediate"
  ])
}

# Monitor 8: Forecast Monitor - Predict Future Capacity Issues
resource "datadog_monitor" "kafka_throughput_forecast" {
  name    = "PetTwin Care - Kafka Throughput Capacity Forecast"
  type    = "query alert"
  message = <<-EOT
    📊 **Capacity Planning Alert - Kafka Throughput Forecast**

    **Predicted to exceed capacity limits within 7 days based on current trend.**

    **Current Trend:**
    - Messages/hour: {{value}}
    - Growth Rate: Increasing
    - Forecast: Capacity reached in ~7 days

    **Recommended Actions:**
    1. Review current throughput trends
    2. Plan capacity scaling for Kafka cluster
    3. Optimize consumer performance
    4. Consider horizontal scaling
    5. Review retention policies

    **Resources:**
    - Confluent Cloud Dashboard: https://confluent.cloud
    - Capacity Planning Guide: docs/CAPACITY_PLANNING.md

    This is a proactive alert to prevent future incidents.

    @${var.alert_email}
  EOT

  # Using trend/forecast function to predict future values
  query = "forecast(avg:pettwin.kafka.messages.consumed{*}.as_rate(), 'linear', 1) > 10000"

  monitor_thresholds {
    critical = 10000.0
    warning  = 8000.0
  }

  tags = concat(local.common_tags, [
    "service:kafka",
    "alert:forecast",
    "severity:low",
    "type:capacity-planning"
  ])
}

# Monitor 9: Anomaly Detection - Unusual Pet Activity Patterns
resource "datadog_monitor" "pet_activity_anomaly" {
  name    = "PetTwin Care - Unusual Pet Activity Pattern Detected"
  type    = "query alert"
  message = <<-EOT
    🐕 **Pet Activity Anomaly Detected**

    **Unusual activity pattern detected for pet: {{pet.name}}**

    **Details:**
    - Activity Score: {{value}}
    - Expected Range: Based on historical baseline
    - Detection: ML-based anomaly detection

    **Potential Causes:**
    - Normal behavioral changes
    - Health status change
    - Sensor malfunction
    - Data quality issue

    **Actions:**
    1. Review pet's recent activity history
    2. Check sensor connectivity and battery
    3. Verify data quality
    4. Consult veterinary guidelines if persistent

    **Pet Owner Notification:** Consider alerting pet owner if anomaly persists.

    @${var.alert_email}
  EOT

  query = "avg(last_30m):anomalies(avg:pettwin.pet.health.activity_score{*} by {pet}, 'agile', 3, direction='both', interval=60, alert_window='last_30m', count_default_zero='true') >= 1"

  monitor_thresholds {
    critical          = 1.0
    critical_recovery = 0.0
  }

  notify_no_data    = true
  no_data_timeframe = 60

  tags = concat(local.common_tags, [
    "service:health-monitoring",
    "alert:pet-activity",
    "severity:low",
    "ml:anomaly-detection"
  ])
}

# Monitor 10: Outlier Detection - Vertex AI Latency Outliers
resource "datadog_monitor" "vertex_ai_latency_outlier" {
  name    = "PetTwin Care - Vertex AI Latency Outlier Detection"
  type    = "query alert"
  message = <<-EOT
    🎯 **Vertex AI Performance Outlier Detected**

    **Specific inference requests are taking significantly longer than average.**

    **Statistics:**
    - Outlier Latency: {{value}} ms
    - Average Latency: {{avg}} ms
    - Deviation: {{deviation}}x normal

    **Potential Causes:**
    - Complex input requiring more processing
    - Specific model bottleneck
    - API throttling for this request type
    - Regional latency spike

    **Investigation:**
    1. Review the specific request that triggered outlier
    2. Check Gemini API quotas and throttling
    3. Analyze request payload complexity
    4. Review regional API performance

    **Impact:** Isolated performance issue, not affecting overall system.

    @${var.alert_email}
  EOT

  query = "avg(last_15m):outliers(avg:pettwin.vertex.ai.inference.latency{model:gemini-pro}, 'dbscan', 2) > 0"

  monitor_thresholds {
    critical = 0.0
  }

  tags = concat(local.common_tags, [
    "service:vertex-ai",
    "alert:outlier",
    "severity:low",
    "ml:outlier-detection"
  ])
}

# Monitor 11: SLO Burn Rate - Fast Burn Alert
resource "datadog_monitor" "slo_burn_rate_fast" {
  name    = "PetTwin Care - SLO Error Budget Fast Burn Alert"
  type    = "slo alert"
  message = <<-EOT
    🔥 **SLO Error Budget Burning Fast!**

    **Your error budget is being consumed at an unsustainable rate.**

    **Details:**
    - Service: Vertex AI Availability SLO
    - Burn Rate: Fast (will exhaust budget in < 2 days)
    - Remaining Budget: {{value}}%

    **This indicates ongoing reliability issues that need immediate attention.**

    **Actions:**
    1. Investigate recent changes or deployments
    2. Review error rate trends
    3. Check infrastructure health
    4. Consider rollback if recent deployment
    5. Implement immediate fixes

    **SLO Details:**
    - Target: 99.5% availability (7d)
    - Current Status: [View SLO](https://app.datadoghq.eu/slo/${datadog_service_level_objective.vertex_ai_availability.id})

    @${var.alert_email}
    @oncall-sre
  EOT

  query = "burn_rate(${datadog_service_level_objective.vertex_ai_availability.id}).over(\"1h\").long_window(\"1d\").short_window(\"5m\") > 14.4"

  tags = concat(local.common_tags, [
    "service:vertex-ai",
    "alert:slo-burn",
    "severity:high",
    "type:reliability"
  ])
}

# Monitor 12: Multi-Alert - Regional Health Check
resource "datadog_monitor" "regional_health_multi" {
  name    = "PetTwin Care - Multi-Region Health Check"
  type    = "metric alert"
  message = <<-EOT
    🌍 **Regional Performance Degradation**

    **Region {{region.name}} experiencing performance issues.**

    **Affected Region:** {{region.name}}
    **Metric Impact:** {{value}}

    **Investigation:**
    1. Check regional infrastructure status
    2. Verify network connectivity for this region
    3. Review load balancer health
    4. Consider traffic shifting to healthy regions

    @${var.alert_email}
  EOT

  query = "avg(last_10m):avg:pettwin.vertex.ai.inference.latency{*} by {region} > 3000"

  monitor_thresholds {
    critical = 3000.0
    warning  = 2000.0
  }

  tags = concat(local.common_tags, [
    "service:vertex-ai",
    "alert:regional",
    "severity:medium",
    "type:multi-alert"
  ])
}
