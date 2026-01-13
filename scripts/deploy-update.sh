#!/bin/bash

# Simple update/redeploy script for Azure Storage
# Run this after making changes to redeploy your app

set -e

echo "🔨 Building application..."
npm run build

if [ ! -d "dist" ]; then
    echo "❌ Build failed - dist folder not found"
    exit 1
fi

echo ""
echo "📤 Deploying to Azure Storage..."
echo ""

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo "❌ Azure CLI is not installed."
    echo "Install from: https://docs.microsoft.com/cli/azure/install-azure-cli"
    exit 1
fi

# Prompt for storage account name (or set default)
read -p "Enter storage account name (or press Enter to use default): " STORAGE_ACCOUNT

if [ -z "$STORAGE_ACCOUNT" ]; then
    echo "❌ Storage account name is required"
    echo "If this is your first deployment, run: ./deploy-to-storage.sh"
    exit 1
fi

# Get storage account key
echo "🔑 Getting storage credentials..."
STORAGE_KEY=$(az storage account keys list \
  --account-name "$STORAGE_ACCOUNT" \
  --query '[0].value' -o tsv 2>/dev/null)

if [ -z "$STORAGE_KEY" ]; then
    echo "❌ Could not find storage account: $STORAGE_ACCOUNT"
    echo "Make sure you've run: ./deploy-to-storage.sh first"
    exit 1
fi

# Upload files
echo "📤 Uploading files..."
az storage blob upload-batch \
  --account-name "$STORAGE_ACCOUNT" \
  --account-key "$STORAGE_KEY" \
  --source ./dist \
  --destination '$web' \
  --overwrite \
  --output none

# Get website URL
WEBSITE_URL=$(az storage account show \
  --name "$STORAGE_ACCOUNT" \
  --query "primaryEndpoints.web" \
  --output tsv)

# Remove trailing slash
WEBSITE_URL=${WEBSITE_URL%/}

echo ""
echo "✅ Deployment complete!"
echo "🌐 Your app: $WEBSITE_URL"
echo ""
