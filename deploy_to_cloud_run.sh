#!/bin/bash
# Deploy to Google Cloud Run matching local .env configuration

# Load local .env variables
export $(grep -v '^#' .env | xargs)

echo "🚀 Deploying Backend to Cloud Run..."
gcloud run deploy pettwin-backend \
    --image us-central1-docker.pkg.dev/mindful-pillar-482716-r9/pettwin-repo/backend \
    --region us-central1 \
    --platform managed \
    --allow-unauthenticated \
    --set-env-vars "CONFLUENT_BOOTSTRAP_SERVERS=$CONFLUENT_BOOTSTRAP_SERVERS" \
    --set-env-vars "CONFLUENT_API_KEY=$CONFLUENT_API_KEY" \
    --set-env-vars "CONFLUENT_API_SECRET=$CONFLUENT_API_SECRET" \
    --set-env-vars "PROJECT_ID=mindful-pillar-482716-r9" \
    --project mindful-pillar-482716-r9

echo "🚀 Deploying Frontend to Cloud Run..."
# Note: Frontend needs to know where Backend is. 
# We'll get the backend URL first.
BACKEND_URL=$(gcloud run services describe pettwin-backend --region us-central1 --format 'value(status.url)' --project mindful-pillar-482716-r9)

echo "🔗 Backend URL detected: $BACKEND_URL"

gcloud run deploy pettwin-frontend \
    --image us-central1-docker.pkg.dev/mindful-pillar-482716-r9/pettwin-repo/frontend \
    --region us-central1 \
    --platform managed \
    --allow-unauthenticated \
    --set-env-vars "NEXT_PUBLIC_API_URL=$BACKEND_URL" \
    --project mindful-pillar-482716-r9

echo "✅ Deployment Complete!"
echo "🌍 Frontend Live URL: $(gcloud run services describe pettwin-frontend --region us-central1 --format 'value(status.url)' --project mindful-pillar-482716-r9)"
