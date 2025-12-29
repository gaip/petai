"""
Generate professional architecture diagram for Devpost submission
Uses diagrams library to create a visual representation of the PetTwin Care system

Installation: pip install diagrams
"""

try:
    from diagrams import Diagram, Cluster, Edge
    from diagrams.gcp.compute import Run, Functions, GKE
    from diagrams.gcp.database import Firestore, Bigtable
    from diagrams.gcp.analytics import Bigquery, Pubsub
    from diagrams.gcp.ml import AI
    from diagrams.onprem.client import Users, Client
    from diagrams.onprem.queue import Kafka
    from diagrams.programming.framework import React, FastAPI

    print("✅ All diagram dependencies loaded")
except ImportError as e:
    print(f"⚠️  Missing dependency: {e}")
    print("Run: pip install diagrams")
    exit(1)

# Architecture diagram configuration
graph_attr = {
    "fontsize": "16",
    "bgcolor": "white",
    "pad": "0.5",
    "splines": "ortho",
    "nodesep": "0.8",
    "ranksep": "1.0"
}

node_attr = {
    "fontsize": "14",
    "height": "1.5",
    "width": "1.5"
}

edge_attr = {
    "fontsize": "12"
}

with Diagram(
    "PetTwin Care - Real-Time AI Architecture\\nConfluent + Vertex AI Integration",
    filename="docs/pettwin_architecture",
    show=False,
    direction="LR",
    graph_attr=graph_attr,
    node_attr=node_attr,
    edge_attr=edge_attr,
    outformat="png"
):

    # User/Client Layer
    with Cluster("Users"):
        pet_owner = Users("Pet Owner")
        veterinarian = Users("Veterinarian")

    # Data Sources
    with Cluster("Data Ingestion"):
        smartphone = Client("Smartphone\\n(Camera + Sensors)")
        smart_collar = Client("Smart Collar\\n(Optional BLE)")

    # Confluent Streaming Layer
    with Cluster("Confluent Cloud - Real-Time Data Backbone"):
        kafka_producer = Kafka("Kafka Producer\\n(Python)")
        pet_health_topic = Kafka("Topic:\\npet-health-stream")
        kafka_consumer = Kafka("Kafka Consumer\\n(AI Processor)")

    # Google Cloud AI Processing
    with Cluster("Google Cloud Platform - AI & Processing"):
        with Cluster("Compute"):
            cloud_run_api = Run("Cloud Run\\nFastAPI Backend")
            cloud_functions = Functions("Cloud Functions\\nAlert Processor")

        with Cluster("AI/ML"):
            vertex_ai = AI("Vertex AI\\nAnomaly Detection")
            gemini = AI("Gemini Pro\\nNL Generation")

        with Cluster("Data Storage"):
            firestore = Firestore("Firestore\\nDigital Twin DB")
            bigquery = Bigquery("BigQuery\\nAnalytics")

    # Frontend Applications
    with Cluster("Frontend"):
        web_app = React("Next.js\\nWeb Application")
        mobile_app = Client("Mobile App\\n(Future)")

    # Data Flow - Ingestion Pipeline
    smartphone >> Edge(label="video/movement", color="blue") >> kafka_producer
    smart_collar >> Edge(label="BLE telemetry", color="blue") >> kafka_producer
    kafka_producer >> Edge(label="stream", color="darkblue", style="bold") >> pet_health_topic

    # Stream Processing
    pet_health_topic >> Edge(label="consume", color="darkblue", style="bold") >> kafka_consumer
    kafka_consumer >> Edge(label="detect", color="red") >> vertex_ai
    vertex_ai >> Edge(label="anomaly data", color="orange") >> gemini
    gemini >> Edge(label="NL alert", color="green") >> cloud_functions

    # Backend Integration
    cloud_functions >> Edge(label="store", color="purple") >> firestore
    cloud_run_api >> Edge(label="read/write", color="purple") >> firestore
    kafka_consumer >> Edge(label="batch load", color="gray", style="dashed") >> bigquery

    # User Interface
    web_app >> Edge(label="REST API", color="black") >> cloud_run_api
    mobile_app >> Edge(label="REST API", color="black") >> cloud_run_api
    firestore >> Edge(label="real-time sync", color="green", style="dotted") >> web_app

    # User Access
    pet_owner >> Edge(label="monitor pet", color="darkgreen") >> web_app
    veterinarian >> Edge(label="health reports", color="darkgreen") >> web_app
    bigquery >> Edge(label="analytics", color="gray", style="dashed") >> veterinarian

print("✅ Architecture diagram generated successfully!")
print("📁 Saved as: docs/pettwin_architecture.png")
print("\nKey Components Highlighted:")
print("  • Blue: Data ingestion flow")
print("  • Dark Blue: Confluent streaming (BOLD)")
print("  • Red: AI anomaly detection")
print("  • Orange: Gemini processing")
print("  • Green: Real-time alerts & sync")
print("  • Purple: Database operations")
print("\n📸 Use this diagram in your Devpost submission!")
