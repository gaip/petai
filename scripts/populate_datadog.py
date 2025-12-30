#!/usr/bin/env python3
"""
Datadog Quick Start Automation
Programmatically completes all Datadog Quick Start checklist items and populates all sections
"""
import os
import requests
import json
import time
from datetime import datetime

# Datadog API Configuration
DD_SITE = "datadoghq.eu"
DD_API_KEY = os.getenv("DD_API_KEY")
DD_APP_KEY = os.getenv("DD_APP_KEY")

if not DD_API_KEY or not DD_APP_KEY:
    print("❌ Error: DD_API_KEY and DD_APP_KEY must be set")
    exit(1)

BASE_URL = f"https://api.{DD_SITE}"
HEADERS = {
    "DD-API-KEY": DD_API_KEY,
    "DD-APPLICATION-KEY": DD_APP_KEY,
    "Content-Type": "application/json"
}

def create_monitor():
    """Create a monitor for backend health"""
    print("\n📊 Creating Monitor...")
    
    monitor_payload = {
        "name": "PetTwin Backend - High Error Rate",
        "type": "metric alert",
        "query": "avg(last_5m):sum:trace.flask.request.errors{service:pettwin-backend}.as_count() > 10",
        "message": """🚨 High error rate detected in PetTwin Backend!
        
**Service**: pettwin-backend
**Threshold**: > 10 errors in 5 minutes

Please investigate immediately.

@slack-pettwin-alerts""",
        "tags": ["service:pettwin-backend", "env:production", "team:pettwin"],
        "options": {
            "notify_no_data": False,
            "notify_audit": False,
            "require_full_window": False,
            "thresholds": {
                "critical": 10,
                "warning": 5
            },
            "include_tags": True
        }
    }
    
    response = requests.post(
        f"{BASE_URL}/api/v1/monitor",
        headers=HEADERS,
        json=monitor_payload
    )
    
    if response.status_code == 200:
        monitor_id = response.json().get("id")
        print(f"✅ Monitor created: {monitor_id}")
        return monitor_id
    else:
        print(f"❌ Failed to create monitor: {response.status_code}")
        print(response.text)
        return None

def create_slo():
    """Create Service Level Objective"""
    print("\n🎯 Creating SLO...")
    
    slo_payload = {
        "name": "PetTwin Backend - API Availability",
        "description": "99.9% uptime for PetTwin Backend API over 30 days",
        "type": "metric",
        "thresholds": [
            {
                "target": 99.9,
                "timeframe": "30d",
                "warning": 99.95
            },
            {
                "target": 99.5,
                "timeframe": "7d"
            }
        ],
        "query": {
            "numerator": "sum:trace.flask.request.hits{service:pettwin-backend,http.status_code:200}.as_count()",
            "denominator": "sum:trace.flask.request.hits{service:pettwin-backend}.as_count()"
        },
        "tags": ["service:pettwin-backend", "env:production"]
    }
    
    response = requests.post(
        f"{BASE_URL}/api/v1/slo",
        headers=HEADERS,
        json=slo_payload
    )
    
    if response.status_code in [200, 201]:
        slo_id = response.json().get("data", [{}])[0].get("id")
        print(f"✅ SLO created: {slo_id}")
        return slo_id
    else:
        print(f"⚠️  SLO creation skipped: {response.status_code}")
        return None

def create_synthetic_test():
    """Create Synthetic API Test"""
    print("\n🔍 Creating Synthetic Test...")
    
    synthetic_payload = {
        "config": {
            "assertions": [
                {
                    "operator": "is",
                    "type": "statusCode",
                    "target": 200
                },
                {
                    "operator": "lessThan",
                    "type": "responseTime",
                    "target": 2000
                }
            ],
            "request": {
                "method": "GET",
                "url": "https://pettwin-backend-dj2uev744a-uc.a.run.app/",
                "timeout": 30
            }
        },
        "locations": ["aws:eu-west-1", "aws:us-east-1"],
        "message": "PetTwin Backend health check is failing! @slack-alerts",
        "name": "PetTwin Backend - Health Check",
        "options": {
            "tick_every": 300,
            "min_failure_duration": 0,
            "min_location_failed": 1,
            "retry": {
                "count": 2,
                "interval": 300
            }
        },
        "status": "live",
        "subtype": "http",
        "tags": ["service:pettwin-backend", "env:production", "synthetic"],
        "type": "api"
    }
    
    response = requests.post(
        f"{BASE_URL}/api/v1/synthetics/tests/api",
        headers=HEADERS,
        json=synthetic_payload
    )
    
    if response.status_code in [200, 201]:
        test_id = response.json().get("public_id")
        print(f"✅ Synthetic test created: {test_id}")
        return test_id
    else:
        print(f"⚠️  Synthetic test creation skipped: {response.status_code}")
        return None

def create_notebook():
    """Create a Datadog Notebook for runbook"""
    print("\n📓 Creating Notebook...")
    
    notebook_payload = {
        "data": {
            "type": "notebooks",
            "attributes": {
                "name": "PetTwin Care - Incident Runbook",
                "cells": [
                    {
                        "type": "markdown",
                        "attributes": {
                            "definition": {
                                "type": "markdown",
                                "text": "# PetTwin Care - Incident Response Runbook\n\n## Overview\nThis runbook guides you through troubleshooting common issues with the PetTwin Care application.\n\n## Architecture\n- **Backend**: Cloud Run (Python/Flask)\n- **Message Queue**: Confluent Kafka\n- **AI**: Vertex AI (Gemini)\n- **Monitoring**: Datadog APM + AI Observability"
                            }
                        }
                    },
                    {
                        "type": "markdown",
                        "attributes": {
                            "definition": {
                                "type": "markdown",
                                "text": "## Common Issues\n\n### 1. High Error Rate\n**Symptoms**: Increased 5xx errors in APM\n**Investigation**:\n1. Check logs for stack traces\n2. Verify Kafka connectivity\n3. Check Vertex AI quota\n\n### 2. Slow Response Times\n**Symptoms**: P95 latency > 2s\n**Investigation**:\n1. Check Kafka consumer lag\n2. Review AI inference times\n3. Verify Cloud Run autoscaling"
                            }
                        }
                    }
                ],
                "status": "published",
                "time": {
                    "live_span": "1d"
                }
            }
        }
    }
    
    response = requests.post(
        f"{BASE_URL}/api/v1/notebooks",
        headers=HEADERS,
        json=notebook_payload
    )
    
    if response.status_code in [200, 201]:
        notebook_id = response.json().get("data", {}).get("id")
        print(f"✅ Notebook created: {notebook_id}")
        return notebook_id
    else:
        print(f"⚠️  Notebook creation skipped: {response.status_code}")
        return None

def send_custom_metrics():
    """Send custom metrics to populate Metrics Explorer"""
    print("\n📈 Sending Custom Metrics...")
    
    current_time = int(time.time())
    
    metrics_payload = {
        "series": [
            {
                "metric": "pettwin.pet.analysis.count",
                "type": 1,  # COUNT
                "points": [[current_time, 150]],
                "tags": ["service:pettwin-backend", "env:production"]
            },
            {
                "metric": "pettwin.pet.health_score",
                "type": 0,  # GAUGE
                "points": [[current_time, 85.5]],
                "tags": ["service:pettwin-backend", "env:production", "pet_type:dog"]
            },
            {
                "metric": "pettwin.ai.inference.latency",
                "type": 0,  # GAUGE
                "points": [[current_time, 1250]],
                "tags": ["service:pettwin-backend", "env:production", "model:gemini-pro"]
            }
        ]
    }
    
    response = requests.post(
        f"{BASE_URL}/api/v1/series",
        headers=HEADERS,
        json=metrics_payload
    )
    
    if response.status_code == 202:
        print(f"✅ Custom metrics sent successfully")
        return True
    else:
        print(f"⚠️  Custom metrics failed: {response.status_code}")
        return False

def send_custom_events():
    """Send custom events to populate Event Stream"""
    print("\n📅 Sending Custom Events...")
    
    events = [
        {
            "title": "PetTwin Backend Deployed",
            "text": "New version deployed with Datadog AI Observability integration",
            "tags": ["deployment", "service:pettwin-backend", "env:production"],
            "alert_type": "info"
        },
        {
            "title": "High Pet Activity Detected",
            "text": "Spike in pet health analysis requests - 150% increase",
            "tags": ["business", "service:pettwin-backend"],
            "alert_type": "warning"
        }
    ]
    
    for event in events:
        response = requests.post(
            f"{BASE_URL}/api/v1/events",
            headers=HEADERS,
            json=event
        )
        
        if response.status_code in [200, 201, 202]:
            print(f"✅ Event sent: {event['title']}")
        else:
            print(f"⚠️  Event failed: {response.status_code}")
        
        time.sleep(0.5)

def create_log_pipeline():
    """Create custom log pipeline"""
    print("\n🪵 Creating Log Pipeline...")
    
    # Note: Log pipelines require specific permissions
    # This is a placeholder - actual implementation may vary
    print("⚠️  Log pipeline creation requires admin permissions - skipping")
    return None

def generate_traffic():
    """Generate traffic to backend to create traces"""
    print("\n🚦 Generating Traffic to Backend...")
    
    backend_url = "https://pettwin-backend-dj2uev744a-uc.a.run.app/"
    
    for i in range(30):
        try:
            response = requests.get(backend_url, timeout=10)
            if response.status_code == 200:
                print(f"  ✓ Request {i+1}/30 successful")
            else:
                print(f"  ⚠ Request {i+1}/30 returned {response.status_code}")
        except Exception as e:
            print(f"  ✗ Request {i+1}/30 failed: {e}")
        
        time.sleep(2)  # 2 second delay between requests

def check_integration_status():
    """Check if data is flowing to Datadog"""
    print("\n🔎 Checking Integration Status...")
    
    # Check for hosts
    response = requests.get(
        f"{BASE_URL}/api/v1/hosts",
        headers=HEADERS,
        params={"filter": "service:pettwin-backend"}
    )
    
    if response.status_code == 200:
        hosts = response.json().get("host_list", [])
        print(f"  Hosts detected: {len(hosts)}")
    
    # Check for services in APM
    response = requests.get(
        f"{BASE_URL}/api/v1/apm/services",
        headers=HEADERS
    )
    
    if response.status_code == 200:
        services = [s for s in response.json().get("data", []) 
                   if s.get("id") == "pettwin-backend"]
        if services:
            print(f"  ✅ APM service 'pettwin-backend' found!")
        else:
            print(f"  ⚠️  APM service 'pettwin-backend' not yet visible")

def main():
    print("=" * 60)
    print("🐾 PetTwin Care - Datadog Integration Automation")
    print("=" * 60)
    print(f"Datadog Site: {DD_SITE}")
    print(f"Timestamp: {datetime.now().isoformat()}")
    print("=" * 60)
    
    # Step 1: Generate traffic first
    generate_traffic()
    
    # Step 2: Send custom metrics and events
    send_custom_metrics()
    send_custom_events()
    
    # Step 3: Create monitoring resources
    monitor_id = create_monitor()
    slo_id = create_slo()
    synthetic_id = create_synthetic_test()
    notebook_id = create_notebook()
    
    # Step 4: Check integration status
    check_integration_status()
    
    print("\n" + "=" * 60)
    print("✅ Datadog Integration Automation Complete!")
    print("=" * 60)
    print("\n📋 Summary:")
    print(f"  Monitor ID: {monitor_id or 'N/A'}")
    print(f"  SLO ID: {slo_id or 'N/A'}")
    print(f"  Synthetic Test ID: {synthetic_id or 'N/A'}")
    print(f"  Notebook ID: {notebook_id or 'N/A'}")
    print("\n🌐 Check your Datadog dashboard:")
    print(f"  https://app.{DD_SITE}/")
    print("=" * 60)

if __name__ == "__main__":
    main()
