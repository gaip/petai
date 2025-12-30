#!/usr/bin/env python3
"""
Datadog Dashboard Creator for PetTwin Care
Creates comprehensive dashboards across all Datadog sections for hackathon submission.
"""

import os
import json
from datadog_api_client import ApiClient, Configuration
from datadog_api_client.v1.api.dashboards_api import DashboardsAPI
from datadog_api_client.v1.model.dashboard import Dashboard
from datadog_api_client.v1.model.dashboard_layout_type import DashboardLayoutType
from datadog_api_client.v1.model.widget import Widget
from datadog_api_client.v1.model.widget_definition import WidgetDefinition
from datadog_api_client.v1.model.timeseries_widget_definition import TimeseriesWidgetDefinition
from datadog_api_client.v1.model.timeseries_widget_request import TimeseriesWidgetRequest
from datadog_api_client.v1.model.query_value_widget_definition import QueryValueWidgetDefinition
from datadog_api_client.v1.model.query_value_widget_request import QueryValueWidgetRequest
from datadog_api_client.v1.model.note_widget_definition import NoteWidgetDefinition

# Configuration
DD_SITE = "datadoghq.eu"
DD_API_KEY = os.getenv("DD_API_KEY")
DD_APP_KEY = os.getenv("DD_APP_KEY")

if not DD_API_KEY or not DD_APP_KEY:
    print("❌ Error: DD_API_KEY and DD_APP_KEY must be set")
    print("   Run: export DD_API_KEY=your_key DD_APP_KEY=your_app_key")
    exit(1)

configuration = Configuration()
configuration.api_key["apiKeyAuth"] = DD_API_KEY
configuration.api_key["appKeyAuth"] = DD_APP_KEY
configuration.server_variables["site"] = DD_SITE


def create_executive_dashboard():
    """Create Executive Summary Dashboard"""
    
    dashboard = {
        "title": "PetTwin Care - Executive Summary 🐾",
        "description": "High-level KPIs for stakeholders. Real-time pet health monitoring powered by Confluent Cloud + Vertex AI.",
        "layout_type": "ordered",
        "widgets": [
            # Header Note
            {
                "definition": {
                    "type": "note",
                    "content": "# PetTwin Care - AI-Powered Pet Health Monitoring\n\n**Mission:** Detect pet diseases 8+ days before visible symptoms using real-time streaming analytics.\n\n**Tech Stack:** Confluent Cloud (Kafka) → Vertex AI (Gemini) → Cloud Run\n\n**Impact:** Reducing veterinary burnout by enabling early intervention.",
                    "background_color": "blue",
                    "font_size": "16",
                    "text_align": "left",
                    "show_tick": False,
                    "tick_pos": "50%",
                    "tick_edge": "left"
                }
            },
            # Total Pets Monitored
            {
                "definition": {
                    "type": "query_value",
                    "requests": [{
                        "q": "count:trace.flask.request{service:pettwin-backend}.as_count()",
                        "aggregator": "sum"
                    }],
                    "title": "Total Requests (24h)",
                    "title_size": "16",
                    "title_align": "left",
                    "precision": 0
                }
            },
            # Anomalies Detected
            {
                "definition": {
                    "type": "query_value",
                    "requests": [{
                        "q": "sum:pettwin.anomaly.detected{*}.as_count()",
                        "aggregator": "sum"
                    }],
                    "title": "Anomalies Detected (24h)",
                    "title_size": "16",
                    "title_align": "left",
                    "precision": 0,
                    "custom_unit": "alerts"
                }
            },
            # System Uptime
            {
                "definition": {
                    "type": "query_value",
                    "requests": [{
                        "q": "avg:system.uptime{service:pettwin-backend}",
                        "aggregator": "avg"
                    }],
                    "title": "System Uptime",
                    "title_size": "16",
                    "title_align": "left",
                    "precision": 2,
                    "custom_unit": "%"
                }
            },
            # Anomalies Over Time
            {
                "definition": {
                    "type": "timeseries",
                    "requests": [{
                        "q": "sum:pettwin.anomaly.detected{*}.as_count()",
                        "display_type": "bars",
                        "style": {
                            "palette": "dog_classic",
                            "line_type": "solid",
                            "line_width": "normal"
                        }
                    }],
                    "title": "Anomaly Detection Timeline",
                    "title_size": "16",
                    "title_align": "left",
                    "show_legend": True,
                    "legend_layout": "auto",
                    "legend_columns": ["avg", "min", "max", "value", "sum"]
                }
            },
            # AI Inference Latency
            {
                "definition": {
                    "type": "timeseries",
                    "requests": [{
                        "q": "avg:trace.vertex_ai.generate_content.duration{*} by {service}",
                        "display_type": "line"
                    }],
                    "title": "Vertex AI Inference Latency (ms)",
                    "title_size": "16",
                    "title_align": "left",
                    "yaxis": {
                        "scale": "linear",
                        "label": "",
                        "include_zero": True
                    }
                }
            }
        ]
    }
    
    return dashboard


def create_apm_dashboard():
    """Create APM Performance Dashboard"""
    
    dashboard = {
        "title": "PetTwin Care - AI Pipeline Performance (APM) 🧠",
        "description": "End-to-end tracing: Kafka → Backend → Vertex AI → Firestore",
        "layout_type": "ordered",
        "widgets": [
            {
                "definition": {
                    "type": "note",
                    "content": "## AI Pipeline Tracing\n\nThis dashboard shows distributed traces across:\n- **Kafka Consumer**: Message ingestion\n- **Anomaly Detector**: Z-score calculation\n- **Vertex AI**: Gemini Pro inference\n- **Firestore**: Alert storage",
                    "background_color": "green",
                    "font_size": "14"
                }
            },
            {
                "definition": {
                    "type": "timeseries",
                    "requests": [{
                        "q": "avg:trace.flask.request.duration{service:pettwin-backend} by {resource_name}",
                        "display_type": "line"
                    }],
                    "title": "Request Latency by Endpoint (P50/P95/P99)",
                    "yaxis": {"label": "ms"}
                }
            },
            {
                "definition": {
                    "type": "query_value",
                    "requests": [{
                        "q": "sum:trace.flask.request.errors{service:pettwin-backend}.as_count()",
                        "aggregator": "sum"
                    }],
                    "title": "Error Count (24h)",
                    "precision": 0
                }
            },
            {
                "definition": {
                    "type": "timeseries",
                    "requests": [{
                        "q": "sum:trace.flask.request.hits{service:pettwin-backend}.as_rate()",
                        "display_type": "bars"
                    }],
                    "title": "Throughput (requests/sec)"
                }
            }
        ]
    }
    
    return dashboard


def create_infrastructure_dashboard():
    """Create Infrastructure Health Dashboard"""
    
    dashboard = {
        "title": "PetTwin Care - Cloud Run Infrastructure 🏗️",
        "description": "Container metrics: CPU, Memory, Network, Uptime",
        "layout_type": "ordered",
        "widgets": [
            {
                "definition": {
                    "type": "timeseries",
                    "requests": [{
                        "q": "avg:docker.cpu.usage{service:pettwin-backend}",
                        "display_type": "area"
                    }],
                    "title": "Container CPU Usage (%)",
                    "yaxis": {"max": "100"}
                }
            },
            {
                "definition": {
                    "type": "timeseries",
                    "requests": [{
                        "q": "avg:docker.mem.rss{service:pettwin-backend}",
                        "display_type": "line"
                    }],
                    "title": "Container Memory (MB)"
                }
            },
            {
                "definition": {
                    "type": "query_value",
                    "requests": [{
                        "q": "sum:docker.containers.running{service:pettwin-backend}",
                        "aggregator": "last"
                    }],
                    "title": "Active Containers",
                    "precision": 0
                }
            },
            {
                "definition": {
                    "type": "timeseries",
                    "requests": [
                        {
                            "q": "sum:docker.net.bytes_sent{service:pettwin-backend}",
                            "display_type": "area"
                        },
                        {
                            "q": "sum:docker.net.bytes_rcvd{service:pettwin-backend}",
                            "display_type": "area"
                        }
                    ],
                    "title": "Network I/O (bytes/sec)"
                }
            }
        ]
    }
    
    return dashboard


def create_metrics_dashboard():
    """Create Pet Health Metrics Dashboard"""
    
    dashboard = {
        "title": "PetTwin Care - Pet Health Metrics 💓",
        "description": "Real-time vitals: Heart Rate, Activity, Gait, Anomaly Severity",
        "layout_type": "ordered",
        "widgets": [
            {
                "definition": {
                    "type": "timeseries",
                    "requests": [{
                        "q": "avg:pettwin.pet.heart_rate{*} by {pet_id}",
                        "display_type": "line"
                    }],
                    "title": "Heart Rate Trends (BPM)",
                    "yaxis": {"min": "60", "max": "140"}
                }
            },
            {
                "definition": {
                    "type": "timeseries",
                    "requests": [{
                        "q": "avg:pettwin.pet.activity_score{*} by {pet_id}",
                        "display_type": "area"
                    }],
                    "title": "Activity Score (0-100)"
                }
            },
            {
                "definition": {
                    "type": "timeseries",
                    "requests": [{
                        "q": "avg:pettwin.pet.gait_symmetry{*} by {pet_id}",
                        "display_type": "line"
                    }],
                    "title": "Gait Symmetry (1.0 = perfect)"
                }
            },
            {
                "definition": {
                    "type": "heatmap",
                    "requests": [{
                        "q": "avg:pettwin.anomaly.severity{*} by {pet_id}"
                    }],
                    "title": "Anomaly Severity Heatmap"
                }
            },
            {
                "definition": {
                    "type": "toplist",
                    "requests": [{
                        "q": "top(sum:pettwin.anomaly.detected{*} by {pet_id}.as_count(), 10, 'sum', 'desc')"
                    }],
                    "title": "Top 10 Pets by Anomaly Count"
                }
            }
        ]
    }
    
    return dashboard


def main():
    """Create all dashboards"""
    
    print("🚀 Creating Datadog Dashboards for PetTwin Care...")
    print(f"📍 Site: {DD_SITE}")
    
    dashboards_to_create = [
        ("Executive Summary", create_executive_dashboard),
        ("APM Performance", create_apm_dashboard),
        ("Infrastructure Health", create_infrastructure_dashboard),
        ("Pet Health Metrics", create_metrics_dashboard)
    ]
    
    with ApiClient(configuration) as api_client:
        api_instance = DashboardsAPI(api_client)
        
        for name, creator_func in dashboards_to_create:
            try:
                print(f"\n📊 Creating: {name}...")
                dashboard_json = creator_func()
                
                # Create dashboard
                response = api_instance.create_dashboard(body=dashboard_json)
                
                dashboard_id = response.id
                dashboard_url = f"https://app.{DD_SITE}/dashboard/{dashboard_id}"
                
                print(f"   ✅ Created: {dashboard_url}")
                
            except Exception as e:
                print(f"   ❌ Error creating {name}: {e}")
    
    print("\n" + "="*60)
    print("🎉 Dashboard Creation Complete!")
    print("="*60)
    print(f"\n📍 View all dashboards: https://app.{DD_SITE}/dashboard/lists")
    print("\n💡 Next Steps:")
    print("   1. Generate traffic: python backend/confluent_producer.py")
    print("   2. Start consumer: python backend/confluent_consumer_ai.py")
    print("   3. Wait 2-3 minutes for metrics to populate")
    print("   4. Take screenshots for hackathon submission")


if __name__ == "__main__":
    main()
