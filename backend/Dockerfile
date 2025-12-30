# Backend Dockerfile for Python Consumer on Cloud Run
FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    librdkafka-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY . .

# Environment variables (overwritten by Cloud Run env vars)
ENV PYTHONUNBUFFERED=1

# Copy Datadog Serverless Init (The Agent)
COPY --from=gcr.io/datadoghq/serverless-init:1 /datadog-init /app/datadog-init

# Use the Datadog entrypoint
ENTRYPOINT ["/app/datadog-init"]

# Run the consumer logic (passed to the entrypoint)
CMD ["ddtrace-run", "python", "confluent_consumer_ai.py"]
