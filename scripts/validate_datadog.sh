#!/bin/bash
# Systematic Datadog Validation Script

echo "🔍 DATADOG INTEGRATION VALIDATION"
echo "=================================="
echo ""

echo "1️⃣ Checking APM Services..."
curl -s -H "DD-API-KEY: b6f2a83b6c57d1be666c13cf4ad4cd07" \
     -H "DD-APPLICATION-KEY: 57726f2c9ae3d0f30ecba4a1cfdb06b91acc8f14" \
     "https://api.datadoghq.eu/api/v1/apm/services" | jq '.data[] | select(.id == "pettwin-backend") | {id, type, stats}'

echo ""
echo "2️⃣ Checking Infrastructure Hosts..."
curl -s -H "DD-API-KEY: b6f2a83b6c57d1be666c13cf4ad4cd07" \
     -H "DD-APPLICATION-KEY: 57726f2c9ae3d0f30ecba4a1cfdb06b91acc8f14" \
     "https://api.datadoghq.eu/api/v1/hosts?filter=service:pettwin-backend" | jq '.host_list | length'

echo ""
echo "3️⃣ Checking Metrics..."
curl -s -H "DD-API-KEY: b6f2a83b6c57d1be666c13cf4ad4cd07" \
     -H "DD-APPLICATION-KEY: 57726f2c9ae3d0f30ecba4a1cfdb06b91acc8f14" \
     "https://api.datadoghq.eu/api/v1/search?q=service:pettwin-backend" | jq '.results.metrics[:5]'

echo ""
echo "=================================="
echo "✅ Validation Complete"
