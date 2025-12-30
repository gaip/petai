resource "datadog_monitor" "high_error_rate" {
  name               = "[${var.environment}] High Error Rate on PetTwin Backend"
  type               = "metric alert"
  message            = "Backend error rate is high. Check logs. @pagerduty"
  query              = "avg(last_5m):sum:trace.flask.request.errors{service:pettwin-backend,env:${var.environment}}.as_rate() > 0.05"
  
  monitor_thresholds {
    critical = 0.05
    warning  = 0.02
  }
}

resource "datadog_monitor" "high_latency" {
  name               = "[${var.environment}] High Latency on Vertex AI Inference"
  type               = "metric alert"
  message            = "AI Inference is taking too long (>2s). User experience impacted."
  query              = "avg(last_5m):avg:trace.vertexai.generate_content.duration{service:pettwin-backend,env:${var.environment}} > 2"
  
  monitor_thresholds {
    critical = 2
    warning  = 1
  }
}

resource "datadog_monitor" "anomaly_pet_vitals" {
  name               = "[${var.environment}] Unusual Pet Vitals Detected (Anomaly)"
  type               = "query alert"
  message            = "Pet health metrics have deviated significantly from baseline."
  query              = "avg(last_15m):anomalies(avg:pet.heart_rate{env:${var.environment}}, 'basic', 3, direction='both', alert_window='last_5m', interval=60, count_default_zero='true') >= 1"
}
