# ==========================================
# PetTwin Care - Terraform Variables
# Input configuration for Datadog infrastructure
# ==========================================

variable "datadog_api_key" {
  description = "Datadog API Key (get from: https://app.datadoghq.com/organization-settings/api-keys)"
  type        = string
  sensitive   = true

  validation {
    condition     = length(var.datadog_api_key) > 0
    error_message = "Datadog API key must not be empty. Get one from https://app.datadoghq.com/organization-settings/api-keys"
  }
}

variable "datadog_app_key" {
  description = "Datadog Application Key (get from: https://app.datadoghq.com/organization-settings/application-keys)"
  type        = string
  sensitive   = true

  validation {
    condition     = length(var.datadog_app_key) > 0
    error_message = "Datadog APP key must not be empty. Get one from https://app.datadoghq.com/organization-settings/application-keys"
  }
}

variable "datadog_api_url" {
  description = "Datadog API URL (use https://api.datadoghq.eu/api/v1 for EU region)"
  type        = string
  default     = "https://api.datadoghq.com/api/v1"

  validation {
    condition     = can(regex("^https://api\\.datadoghq\\.(com|eu)/api/v1$", var.datadog_api_url))
    error_message = "Invalid Datadog API URL. Must be either datadoghq.com or datadoghq.eu"
  }
}

variable "environment" {
  description = "Environment name (production, staging, development)"
  type        = string
  default     = "production"

  validation {
    condition     = contains(["production", "staging", "development"], var.environment)
    error_message = "Environment must be one of: production, staging, development"
  }
}

variable "alert_email" {
  description = "Email address for alert notifications"
  type        = string
  default     = "engineering@pettwincare.com"

  validation {
    condition     = can(regex("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", var.alert_email))
    error_message = "Must be a valid email address"
  }
}

variable "dashboard_url" {
  description = "URL to the main Datadog dashboard (will be set after creation)"
  type        = string
  default     = "https://app.datadoghq.eu/dashboard/t7g-ubd-aet"
}

variable "project_name" {
  description = "Project name for resource naming and tagging"
  type        = string
  default     = "pettwin-care"
}

variable "enable_anomaly_detection" {
  description = "Enable anomaly detection on metrics (ML-based)"
  type        = bool
  default     = true
}

variable "alert_renotify_interval" {
  description = "Minutes to wait before re-notifying about an alert"
  type        = number
  default     = 60

  validation {
    condition     = var.alert_renotify_interval >= 0 && var.alert_renotify_interval <= 1440
    error_message = "Renotify interval must be between 0 and 1440 minutes (24 hours)"
  }
}

variable "monitor_evaluation_delay" {
  description = "Seconds to delay monitor evaluation (allows time for metric aggregation)"
  type        = number
  default     = 60

  validation {
    condition     = var.monitor_evaluation_delay >= 0 && var.monitor_evaluation_delay <= 900
    error_message = "Evaluation delay must be between 0 and 900 seconds (15 minutes)"
  }
}

variable "kafka_topic" {
  description = "Kafka topic name for pet health stream"
  type        = string
  default     = "pet-health-stream"
}

variable "vertex_ai_model" {
  description = "Vertex AI model name"
  type        = string
  default     = "gemini-pro"
}

# Threshold configurations
variable "accuracy_critical_threshold" {
  description = "Critical threshold for anomaly detection accuracy (%)"
  type        = number
  default     = 85.0

  validation {
    condition     = var.accuracy_critical_threshold >= 0 && var.accuracy_critical_threshold <= 100
    error_message = "Accuracy threshold must be between 0 and 100"
  }
}

variable "accuracy_warning_threshold" {
  description = "Warning threshold for anomaly detection accuracy (%)"
  type        = number
  default     = 90.0

  validation {
    condition     = var.accuracy_warning_threshold >= 0 && var.accuracy_warning_threshold <= 100
    error_message = "Accuracy threshold must be between 0 and 100"
  }
}

variable "consumer_lag_critical_ms" {
  description = "Critical threshold for Kafka consumer lag (milliseconds)"
  type        = number
  default     = 5000

  validation {
    condition     = var.consumer_lag_critical_ms > 0
    error_message = "Consumer lag threshold must be positive"
  }
}

variable "consumer_lag_warning_ms" {
  description = "Warning threshold for Kafka consumer lag (milliseconds)"
  type        = number
  default     = 1000

  validation {
    condition     = var.consumer_lag_warning_ms > 0
    error_message = "Consumer lag threshold must be positive"
  }
}

variable "error_rate_critical_percent" {
  description = "Critical threshold for error rate (%)"
  type        = number
  default     = 10.0

  validation {
    condition     = var.error_rate_critical_percent >= 0 && var.error_rate_critical_percent <= 100
    error_message = "Error rate threshold must be between 0 and 100"
  }
}

variable "error_rate_warning_percent" {
  description = "Warning threshold for error rate (%)"
  type        = number
  default     = 5.0

  validation {
    condition     = var.error_rate_warning_percent >= 0 && var.error_rate_warning_percent <= 100
    error_message = "Error rate threshold must be between 0 and 100"
  }
}
