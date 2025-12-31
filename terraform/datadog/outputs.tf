# ==========================================
# PetTwin Care - Terraform Outputs
# Values exported after successful deployment
# ==========================================

output "dashboard_url" {
  description = "URL to access the main Datadog dashboard"
  value       = "https://app.datadoghq.${var.datadog_api_url == "https://api.datadoghq.eu/api/v1" ? "eu" : "com"}/dashboard/${datadog_dashboard.pettwin_main.id}"
}

output "dashboard_id" {
  description = "Datadog Dashboard ID"
  value       = datadog_dashboard.pettwin_main.id
}

output "monitor_urls" {
  description = "URLs to access all monitors"
  value = {
    vertex_ai_latency = "https://app.datadoghq.${var.datadog_api_url == "https://api.datadoghq.eu/api/v1" ? "eu" : "com"}/monitors/${datadog_monitor.vertex_ai_latency_anomaly.id}"
    anomaly_accuracy  = "https://app.datadoghq.${var.datadog_api_url == "https://api.datadoghq.eu/api/v1" ? "eu" : "com"}/monitors/${datadog_monitor.anomaly_accuracy_low.id}"
    consumer_lag      = "https://app.datadoghq.${var.datadog_api_url == "https://api.datadoghq.eu/api/v1" ? "eu" : "com"}/monitors/${datadog_monitor.kafka_consumer_lag.id}"
    error_rate        = "https://app.datadoghq.${var.datadog_api_url == "https://api.datadoghq.eu/api/v1" ? "eu" : "com"}/monitors/${datadog_monitor.high_error_rate.id}"
    no_data           = "https://app.datadoghq.${var.datadog_api_url == "https://api.datadoghq.eu/api/v1" ? "eu" : "com"}/monitors/${datadog_monitor.no_data_received.id}"
    heart_rate        = "https://app.datadoghq.${var.datadog_api_url == "https://api.datadoghq.eu/api/v1" ? "eu" : "com"}/monitors/${datadog_monitor.heart_rate_abnormal.id}"
  }
}

output "monitor_ids" {
  description = "Datadog Monitor IDs"
  value = {
    # Core Monitors
    vertex_ai_latency = datadog_monitor.vertex_ai_latency_anomaly.id
    anomaly_accuracy  = datadog_monitor.anomaly_accuracy_low.id
    consumer_lag      = datadog_monitor.kafka_consumer_lag.id
    error_rate        = datadog_monitor.high_error_rate.id
    no_data           = datadog_monitor.no_data_received.id
    heart_rate        = datadog_monitor.heart_rate_abnormal.id

    # Advanced Monitors
    system_critical_composite = datadog_monitor.system_critical_composite.id
    kafka_throughput_forecast = datadog_monitor.kafka_throughput_forecast.id
    pet_activity_anomaly      = datadog_monitor.pet_activity_anomaly.id
    vertex_ai_latency_outlier = datadog_monitor.vertex_ai_latency_outlier.id
    slo_burn_rate_fast        = datadog_monitor.slo_burn_rate_fast.id
    regional_health_multi     = datadog_monitor.regional_health_multi.id
  }
}

output "metrics_namespace" {
  description = "Metrics namespace used for all PetTwin metrics"
  value       = "pettwin"
}

output "deployment_summary" {
  description = "Summary of deployed resources"
  value = {
    dashboards = {
      main      = "Technical Dashboard"
      executive = "Executive Summary"
      total     = 2
    }
    monitors = {
      core     = 6
      advanced = 6
      total    = 12
    }
    slos = {
      vertex_ai_availability = "Vertex AI Availability"
      vertex_ai_latency      = "AI Latency Performance"
      anomaly_accuracy       = "Detection Accuracy"
      kafka_consumer_health  = "Kafka Streaming Health"
      system_health          = "Overall System Health"
      total                  = 5
    }
    environment = var.environment
    project     = var.project_name
  }
}

output "quickstart_commands" {
  description = "Commands to get started with the deployed infrastructure"
  value = {
    view_dashboard = "open ${datadog_dashboard.pettwin_main.url}"
    list_monitors  = "terraform output monitor_urls"
    verify_metrics = "curl -X GET 'https://api.datadoghq.com/api/v1/metrics' -H 'DD-API-KEY: <your-api-key>'"
  }
}

output "documentation_links" {
  description = "Links to relevant documentation"
  value = {
    implementation_guide = "https://github.com/gaip/petai/blob/main/docs/DATADOG_IMPLEMENTATION.md"
    terraform_docs       = "https://registry.terraform.io/providers/DataDog/datadog/latest/docs"
    metrics_reference    = "https://github.com/gaip/petai/blob/main/backend/confluent_consumer_ai.py"
  }
}

# Sensitive outputs (hidden by default)
output "api_endpoints" {
  description = "API endpoints for programmatic access"
  sensitive   = true
  value = {
    metrics_api  = "https://api.datadoghq.${var.datadog_api_url == "https://api.datadoghq.eu/api/v1" ? "eu" : "com"}/api/v1/metrics"
    monitors_api = "https://api.datadoghq.${var.datadog_api_url == "https://api.datadoghq.eu/api/v1" ? "eu" : "com"}/api/v1/monitor"
  }
}
