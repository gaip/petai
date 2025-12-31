# ==========================================
# PetTwin Care - Datadog Infrastructure as Code
# Terraform configuration for complete observability setup
# ==========================================

terraform {
  required_version = ">= 1.0"

  required_providers {
    datadog = {
      source  = "DataDog/datadog"
      version = "~> 3.38"
    }
  }
}

# Configure the Datadog provider
provider "datadog" {
  api_key = var.datadog_api_key
  app_key = var.datadog_app_key
  api_url = var.datadog_api_url  # Use datadoghq.eu for EU region
}

# ==========================================
# Dashboard - Main monitoring dashboard
# ==========================================
resource "datadog_dashboard" "pettwin_main" {
  title        = "PetTwin Care - AI Health Monitoring & LLM Observability"
  description  = "Comprehensive monitoring for AI-powered pet health diagnostics. Tracks Vertex AI/Gemini performance, anomaly detection accuracy, and Kafka streaming health."
  layout_type  = "ordered"
  is_read_only = false

  # Widget 1: Vertex AI Inference Latency (Timeseries with Anomaly Detection)
  widget {
    timeseries_definition {
      title       = "Vertex AI Gemini - Inference Latency (ms)"
      show_legend = true
      legend_size = "0"

      request {
        q = "avg:pettwin.vertex.ai.inference.latency{model:gemini-pro}"
        display_type = "line"
        style {
          palette    = "dog_classic"
          line_type  = "solid"
          line_width = "normal"
        }
      }

      # Anomaly detection overlay
      request {
        q = "anomalies(avg:pettwin.vertex.ai.inference.latency{model:gemini-pro}, 'basic', 2)"
        display_type = "line"
        style {
          palette    = "warm"
          line_type  = "solid"
          line_width = "thick"
        }
      }

      yaxis {
        scale = "linear"
        min   = "auto"
        max   = "auto"
        label = "Latency (ms)"
      }
    }
  }

  # Widget 2: Anomaly Detection Accuracy
  widget {
    query_value_definition {
      title       = "Anomaly Detection Accuracy - Real-time Pet Health Monitoring"
      title_size  = "16"
      title_align = "left"

      request {
        q          = "avg:pettwin.pet.health.anomaly.accuracy{*}"
        aggregator = "avg"
      }

      autoscale   = false
      precision   = 2
      custom_unit = "%"
    }
  }

  # Widget 3: Kafka Consumer Lag
  widget {
    timeseries_definition {
      title       = "Kafka Consumer Lag - Streaming Performance"
      show_legend = true

      request {
        q = "avg:pettwin.kafka.consumer.lag{topic:pet-health-stream}"
        display_type = "line"
        style {
          palette    = "cool"
          line_type  = "solid"
          line_width = "normal"
        }
      }

      yaxis {
        scale = "linear"
        label = "Lag (ms)"
      }
    }
  }

  # Widget 4: AI Success vs Error Rate
  widget {
    timeseries_definition {
      title       = "Vertex AI Success vs Error Rate"
      show_legend = true

      request {
        q = "sum:pettwin.vertex.ai.inference.success{*}.as_rate()"
        display_type = "bars"
        style {
          palette = "green"
        }
      }

      request {
        q = "sum:pettwin.vertex.ai.inference.error{*}.as_rate()"
        display_type = "bars"
        style {
          palette = "red"
        }
      }
    }
  }

  # Widget 5: Messages Produced vs Consumed
  widget {
    timeseries_definition {
      title       = "Kafka Throughput - Messages Produced vs Consumed"
      show_legend = true

      request {
        q = "sum:pettwin.kafka.messages.produced{*}.as_rate()"
        display_type = "line"
        style {
          palette    = "blue"
          line_type  = "solid"
          line_width = "thick"
        }
      }

      request {
        q = "sum:pettwin.kafka.messages.consumed{*}.as_rate()"
        display_type = "line"
        style {
          palette    = "purple"
          line_type  = "dashed"
          line_width = "thick"
        }
      }
    }
  }

  # Widget 6: Pet Health Metrics Heatmap
  widget {
    heatmap_definition {
      title = "Pet Health Vitals - Real-time Monitoring"

      request {
        q = "avg:pettwin.pet.health.heart_rate{*} by {pet}"
      }

      yaxis {
        min = "60"
        max = "150"
      }
    }
  }

  # Widget 7: Anomalies Detected Over Time
  widget {
    query_value_definition {
      title       = "Total Anomalies Detected Today"
      title_size  = "16"
      title_align = "center"

      request {
        q          = "sum:pettwin.pet.health.anomaly.detected{*}.rollup(sum, 86400)"
        aggregator = "sum"
      }

      autoscale = true
      precision = 0
    }
  }

  # Widget 8: Processing Latency Distribution
  widget {
    distribution_definition {
      title = "Pet Health Processing Latency Distribution"

      request {
        q = "avg:pettwin.pet.health.processing.latency{*}"
      }
    }
  }
}

# ==========================================
# Tags
# ==========================================
# These tags will be applied to all resources
locals {
  common_tags = [
    "project:pettwin-care",
    "team:engineering",
    "environment:${var.environment}",
    "managed_by:terraform"
  ]
}
