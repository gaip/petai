# ==========================================
# PetTwin Care - Executive Dashboard
# High-level business metrics and SLO status
# ==========================================

resource "datadog_dashboard" "pettwin_executive" {
  title        = "PetTwin Care - Executive Summary"
  description  = "Business-level view of system health, SLOs, and key performance indicators"
  layout_type  = "ordered"
  is_read_only = false

  # ==========================================
  # Header: System Status Overview
  # ==========================================
  widget {
    note_definition {
      content          = <<-EOT
        # 🐾 PetTwin Care - Executive Dashboard

        **Real-time AI-powered pet health monitoring system**

        This dashboard provides a high-level view of:
        - 🎯 Service Level Objectives (SLOs)
        - 📊 Business Metrics
        - 🚨 Critical Alerts
        - 💰 System Performance

        **Stack:** Google Vertex AI | Confluent Kafka | Next.js
      EOT
      background_color = "blue"
      font_size        = "16"
      text_align       = "center"
      show_tick        = false
      has_padding      = true
    }
  }

  # ==========================================
  # SLO Status Summary
  # ==========================================
  widget {
    group_definition {
      title       = "🎯 Service Level Objectives (SLOs)"
      layout_type = "ordered"

      # SLO Widget 1: Vertex AI Availability
      widget {
        slo_definition {
          title             = "Vertex AI Availability (7d target: 99.5%)"
          view_type         = "detail"
          slo_id            = datadog_service_level_objective.vertex_ai_availability.id
          show_error_budget = true
          view_mode         = "overall"
          time_windows      = ["7d", "30d"]
        }
      }

      # SLO Widget 2: Anomaly Detection Accuracy
      widget {
        slo_definition {
          title             = "Detection Accuracy (7d target: 90%)"
          view_type         = "detail"
          slo_id            = datadog_service_level_objective.anomaly_accuracy.id
          show_error_budget = true
          view_mode         = "overall"
          time_windows      = ["7d", "30d"]
        }
      }

      # SLO Widget 3: System Health
      widget {
        slo_definition {
          title             = "Overall System Health (7d target: 99%)"
          view_type         = "detail"
          slo_id            = datadog_service_level_objective.system_health.id
          show_error_budget = true
          view_mode         = "overall"
          time_windows      = ["7d", "30d"]
        }
      }
    }
  }

  # ==========================================
  # Business Metrics
  # ==========================================
  widget {
    group_definition {
      title       = "📊 Business Metrics"
      layout_type = "ordered"

      # Total Anomalies Detected (Business Impact)
      widget {
        query_value_definition {
          title = "Total Pet Health Anomalies Detected (24h)"
          request {
            q          = "sum:pettwin.pet.health.anomaly.detected{*}.as_count()"
            aggregator = "sum"
          }
          precision = 0
        }
      }

      # AI Requests Processed
      widget {
        query_value_definition {
          title = "AI Inference Requests Processed (24h)"
          request {
            q          = "sum:pettwin.vertex.ai.inference.success{*}.as_count()"
            aggregator = "sum"
          }
          precision = 0
        }
      }

      # Kafka Messages Processed
      widget {
        query_value_definition {
          title = "Pet Health Messages Processed (24h)"
          request {
            q          = "sum:pettwin.kafka.messages.consumed{*}.as_count()"
            aggregator = "sum"
          }
          precision = 0
        }
      }

      # System Availability %
      widget {
        query_value_definition {
          title = "System Availability (24h)"
          request {
            q          = "(sum:pettwin.vertex.ai.inference.success{*}.as_count() / (sum:pettwin.vertex.ai.inference.success{*}.as_count() + sum:pettwin.vertex.ai.inference.error{*}.as_count())) * 100"
            aggregator = "avg"
          }
          custom_unit = "%"
          precision   = 2
        }
      }
    }
  }

  # ==========================================
  # Performance Trends
  # ==========================================
  widget {
    timeseries_definition {
      title       = "📈 AI Inference Requests Over Time"
      show_legend = true

      request {
        q            = "sum:pettwin.vertex.ai.inference.success{*}.as_count()"
        display_type = "bars"
        style {
          palette    = "green"
          line_type  = "solid"
          line_width = "normal"
        }
      }

      request {
        q            = "sum:pettwin.vertex.ai.inference.error{*}.as_count()"
        display_type = "bars"
        style {
          palette    = "red"
          line_type  = "solid"
          line_width = "normal"
        }
      }

      yaxis {
        include_zero = true
      }
    }
  }

  # ==========================================
  # System Health Indicators
  # ==========================================
  widget {
    group_definition {
      title       = "🏥 System Health Indicators"
      layout_type = "ordered"

      # Current Detection Accuracy
      widget {
        query_value_definition {
          title = "Current Detection Accuracy"
          request {
            q          = "avg:pettwin.pet.health.anomaly.accuracy{*}"
            aggregator = "avg"
          }
          custom_unit = "%"
          precision   = 1
        }
      }

      # Average AI Latency
      widget {
        query_value_definition {
          title = "Average AI Inference Latency"
          request {
            q          = "avg:pettwin.vertex.ai.inference.latency{*}"
            aggregator = "avg"
          }
          custom_unit = "ms"
          precision   = 0
        }
      }

      # Kafka Consumer Lag
      widget {
        query_value_definition {
          title = "Kafka Consumer Lag"
          request {
            q          = "avg:pettwin.kafka.consumer.lag{*}"
            aggregator = "avg"
          }
          custom_unit = "ms"
          precision   = 0
        }
      }

      # Error Rate
      widget {
        query_value_definition {
          title = "Current Error Rate"
          request {
            q          = "(sum:pettwin.vertex.ai.inference.error{*}.as_count() / (sum:pettwin.vertex.ai.inference.success{*}.as_count() + sum:pettwin.vertex.ai.inference.error{*}.as_count())) * 100"
            aggregator = "avg"
          }
          custom_unit = "%"
          precision   = 2
        }
      }
    }
  }

  # ==========================================
  # Active Alerts
  # ==========================================
  widget {
    alert_graph_definition {
      title    = "🚨 Active Alerts"
      alert_id = datadog_monitor.vertex_ai_latency_anomaly.id
      viz_type = "timeseries"
    }
  }

  # ==========================================
  # Anomaly Detection Performance
  # ==========================================
  widget {
    timeseries_definition {
      title       = "🔍 Anomaly Detection Accuracy Trend"
      show_legend = true

      request {
        q            = "avg:pettwin.pet.health.anomaly.accuracy{*}"
        display_type = "line"
        style {
          palette    = "dog_classic"
          line_type  = "solid"
          line_width = "normal"
        }
      }

      # Target line at 90%
      marker {
        value        = "y = 90"
        display_type = "error dashed"
        label        = "Minimum Target: 90%"
      }

      # Warning line at 92%
      marker {
        value        = "y = 92"
        display_type = "warning dashed"
        label        = "Validated Performance: 92%"
      }

      yaxis {
        min          = "80"
        max          = "100"
        include_zero = false
      }
    }
  }

  # ==========================================
  # Cost Efficiency (AI Requests vs Anomalies)
  # ==========================================
  widget {
    timeseries_definition {
      title       = "💰 Detection Efficiency (Anomalies per 100 AI Requests)"
      show_legend = true

      request {
        q            = "(sum:pettwin.pet.health.anomaly.detected{*}.as_count() / sum:pettwin.vertex.ai.inference.success{*}.as_count()) * 100"
        display_type = "line"
        style {
          palette    = "purple"
          line_type  = "solid"
          line_width = "thick"
        }
      }

      yaxis {
        include_zero = true
      }
    }
  }

  # ==========================================
  # Footer: Quick Links
  # ==========================================
  widget {
    note_definition {
      content          = <<-EOT
        ## 🔗 Quick Links

        - **Technical Dashboard**: [View Detailed Metrics](${var.dashboard_url})
        - **SLO Status**: [View All SLOs](https://app.datadoghq.eu/slo/manage)
        - **Incident Management**: [View Monitors](https://app.datadoghq.eu/monitors/manage)
        - **Documentation**: [Implementation Guide](https://github.com/gaip/petai/blob/main/docs/DATADOG_IMPLEMENTATION.md)

        ---

        **Last Updated**: {{current_time}}
      EOT
      background_color = "gray"
      font_size        = "14"
      text_align       = "left"
      show_tick        = false
      has_padding      = true
    }
  }

  tags = concat(local.common_tags, [
    "dashboard:executive",
    "audience:leadership"
  ])
}

# ==========================================
# Executive Dashboard Output
# ==========================================

output "executive_dashboard_url" {
  description = "URL to access the Executive Summary dashboard"
  value       = "https://app.datadoghq.${var.datadog_api_url == "https://api.datadoghq.eu/api/v1" ? "eu" : "com"}/dashboard/${datadog_dashboard.pettwin_executive.id}"
}

output "executive_dashboard_id" {
  description = "Executive Dashboard ID"
  value       = datadog_dashboard.pettwin_executive.id
}
