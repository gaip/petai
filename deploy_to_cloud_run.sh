#!/bin/bash

# Load local .env variables if file exists
if [ -f .env ]; then
    echo "📄 Loading .env file..."
    export $(grep -v '^#' .env | xargs)
else
    echo "⚠️  .env file not found. Deploying with empty environment variables."
    echo "    (You must configure variables in Google Cloud Console manually if needed)"
fi

echo "==================================================="
echo "🚀 Deploying Backend (Python + Confluent + VertexAI)"
echo "==================================================="

# Deploy Backend
# Fetch Git Metadata for Datadog Source Code Integration
GIT_COMMIT_SHA=$(git rev-parse HEAD)
GIT_REPOSITORY_URL="https://github.com/gaip/petai"

echo "🔗 Linking Deployment to Git Commit: $GIT_COMMIT_SHA"

gcloud run deploy pettwin-backend \
    --image us-central1-docker.pkg.dev/mindful-pillar-482716-r9/pettwin-repo/backend \
    --region us-central1 \
    --platform managed \
    --allow-unauthenticated \
    --set-env-vars "PROJECT_ID=mindful-pillar-482716-r9,DD_GIT_REPOSITORY_URL=${GIT_REPOSITORY_URL},DD_GIT_COMMIT_SHA=${GIT_COMMIT_SHA}" \
    --project mindful-pillar-482716-r9
    # Removed explicit env vars here so it doesn't crash if they are missing locally.
    # You can set them in Cloud Console later if needed.

# Get Backend URL
BACKEND_URL=$(gcloud run services describe pettwin-backend --region us-central1 --format 'value(status.url)' --project mindful-pillar-482716-r9)
echo "✅ Backend Live at: $BACKEND_URL"

echo "==================================================="
echo "🚀 Deploying Frontend (Next.js)"
echo "==================================================="

# Deploy Frontend, pointing to the Backend URL
gcloud run deploy pettwin-frontend \
    --image us-central1-docker.pkg.dev/mindful-pillar-482716-r9/pettwin-repo/frontend \
    --region us-central1 \
    --platform managed \
    --allow-unauthenticated \
    --set-env-vars "NEXT_PUBLIC_API_URL=$BACKEND_URL,DD_GIT_REPOSITORY_URL=${GIT_REPOSITORY_URL},DD_GIT_COMMIT_SHA=${GIT_COMMIT_SHA}" \
    --project mindful-pillar-482716-r9

FRONTEND_URL=$(gcloud run services describe pettwin-frontend --region us-central1 --format 'value(status.url)' --project mindful-pillar-482716-r9)

echo "==================================================="
echo "🎉 DEPLOYMENT COMPLETE!"
echo "🌍 WEB URL: $FRONTEND_URL"
echo "==================================================="
