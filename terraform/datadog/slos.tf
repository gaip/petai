# ==========================================
# PetTwin Care - Service Level Objectives (SLOs)
# Production-grade reliability targets
# ==========================================

# SLO 1: Vertex AI Availability - 99.5% uptime
resource "datadog_service_level_objective" "vertex_ai_availability" {
  name        = "PetTwin Care - Vertex AI Gemini Availability"
  type        = "metric"
  description = "Ensure Vertex AI inference service maintains 99.5% availability for pet health diagnostics"

  query {
    numerator   = "sum:pettwin.vertex.ai.inference.success{model:gemini-pro}.as_count()"
    denominator = "sum:pettwin.vertex.ai.inference.success{model:gemini-pro}.as_count() + sum:pettwin.vertex.ai.inference.error{model:gemini-pro}.as_count()"
  }

  thresholds {
    timeframe = "7d"
    target    = 99.5
    warning   = 99.7
  }

  thresholds {
    timeframe = "30d"
    target    = 99.5
    warning   = 99.7
  }

  tags = concat(local.common_tags, [
    "service:vertex-ai",
    "slo:availability",
    "business_critical:true"
  ])
}

# SLO 2: AI Inference Latency - P95 < 2000ms
resource "datadog_service_level_objective" "vertex_ai_latency" {
  name        = "PetTwin Care - Vertex AI Latency Performance"
  type        = "metric"
  description = "95% of AI inference requests complete within 2 seconds"

  query {
    numerator   = "sum:pettwin.vertex.ai.inference.latency{model:gemini-pro}.as_count() - count_nonzero(pettwin.vertex.ai.inference.latency{model:gemini-pro} > 2000)"
    denominator = "sum:pettwin.vertex.ai.inference.latency{model:gemini-pro}.as_count()"
  }

  thresholds {
    timeframe = "7d"
    target    = 95.0
    warning   = 97.0
  }

  thresholds {
    timeframe = "30d"
    target    = 95.0
    warning   = 97.0
  }

  tags = concat(local.common_tags, [
    "service:vertex-ai",
    "slo:latency",
    "business_critical:true"
  ])
}

# SLO 3: Anomaly Detection Accuracy - > 90%
resource "datadog_service_level_objective" "anomaly_accuracy" {
  name        = "PetTwin Care - Anomaly Detection Accuracy SLO"
  type        = "metric"
  description = "Maintain >90% accuracy in pet health anomaly detection"

  query {
    numerator   = "avg:pettwin.pet.health.anomaly.accuracy{*}"
    denominator = "100"
  }

  thresholds {
    timeframe = "7d"
    target    = 90.0
    warning   = 92.0
  }

  thresholds {
    timeframe = "30d"
    target    = 90.0
    warning   = 92.0
  }

  tags = concat(local.common_tags, [
    "service:anomaly-detection",
    "slo:accuracy",
    "business_critical:true"
  ])
}

# SLO 4: Kafka Consumer Health - Lag < 5000ms
resource "datadog_service_level_objective" "kafka_consumer_health" {
  name        = "PetTwin Care - Kafka Streaming Health"
  type        = "metric"
  description = "Ensure real-time streaming with consumer lag under 5 seconds"

  query {
    numerator   = "sum:pettwin.kafka.messages.consumed{topic:pet-health-stream}.as_count() - count_nonzero(pettwin.kafka.consumer.lag{topic:pet-health-stream} > 5000)"
    denominator = "sum:pettwin.kafka.messages.consumed{topic:pet-health-stream}.as_count()"
  }

  thresholds {
    timeframe = "7d"
    target    = 99.0
    warning   = 99.5
  }

  thresholds {
    timeframe = "30d"
    target    = 99.0
    warning   = 99.5
  }

  tags = concat(local.common_tags, [
    "service:kafka",
    "slo:latency",
    "business_critical:true"
  ])
}

# SLO 5: End-to-End System Health - Overall Availability
resource "datadog_service_level_objective" "system_health" {
  name        = "PetTwin Care - Overall System Health"
  type        = "monitor"
  description = "Composite SLO ensuring all critical components are operational"

  monitor_ids = [
    datadog_monitor.vertex_ai_latency_anomaly.id,
    datadog_monitor.anomaly_accuracy_low.id,
    datadog_monitor.kafka_consumer_lag.id,
    datadog_monitor.high_error_rate.id,
  ]

  thresholds {
    timeframe = "7d"
    target    = 99.0
    warning   = 99.5
  }

  thresholds {
    timeframe = "30d"
    target    = 99.0
    warning   = 99.5
  }

  tags = concat(local.common_tags, [
    "service:pettwin-care",
    "slo:overall",
    "business_critical:true"
  ])
}

# ==========================================
# SLO Outputs
# ==========================================

output "slo_ids" {
  description = "Service Level Objective IDs"
  value = {
    vertex_ai_availability = datadog_service_level_objective.vertex_ai_availability.id
    vertex_ai_latency      = datadog_service_level_objective.vertex_ai_latency.id
    anomaly_accuracy       = datadog_service_level_objective.anomaly_accuracy.id
    kafka_consumer_health  = datadog_service_level_objective.kafka_consumer_health.id
    system_health          = datadog_service_level_objective.system_health.id
  }
}

output "slo_status_urls" {
  description = "URLs to view SLO status pages"
  value = {
    vertex_ai_availability = "https://app.datadoghq.${var.datadog_api_url == "https://api.datadoghq.eu/api/v1" ? "eu" : "com"}/slo?slo_id=${datadog_service_level_objective.vertex_ai_availability.id}"
    vertex_ai_latency      = "https://app.datadoghq.${var.datadog_api_url == "https://api.datadoghq.eu/api/v1" ? "eu" : "com"}/slo?slo_id=${datadog_service_level_objective.vertex_ai_latency.id}"
    anomaly_accuracy       = "https://app.datadoghq.${var.datadog_api_url == "https://api.datadoghq.eu/api/v1" ? "eu" : "com"}/slo?slo_id=${datadog_service_level_objective.anomaly_accuracy.id}"
    kafka_consumer_health  = "https://app.datadoghq.${var.datadog_api_url == "https://api.datadoghq.eu/api/v1" ? "eu" : "com"}/slo?slo_id=${datadog_service_level_objective.kafka_consumer_health.id}"
    system_health          = "https://app.datadoghq.${var.datadog_api_url == "https://api.datadoghq.eu/api/v1" ? "eu" : "com"}/slo?slo_id=${datadog_service_level_objective.system_health.id}"
  }
}
