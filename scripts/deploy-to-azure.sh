#!/bin/bash

# TeamPulse Agent - Azure Static Web Apps Deployment Script
# This script deploys your app to Azure Static Web Apps

set -e

echo "🚀 TeamPulse Agent - Azure Deployment Script"
echo "=============================================="
echo ""

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo "❌ Azure CLI is not installed."
    echo "Please install it from: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
fi

echo "✅ Azure CLI found"
echo ""

# Login to Azure
echo "🔐 Logging in to Azure..."
az login

# Get subscription
SUBSCRIPTION_ID=$(az account show --query id -o tsv)
echo "📋 Using subscription: $SUBSCRIPTION_ID"
echo ""

# Prompt for configuration
read -p "Enter resource group name [rg-teampulse]: " RESOURCE_GROUP
RESOURCE_GROUP=${RESOURCE_GROUP:-rg-teampulse}

read -p "Enter Static Web App name [teampulse-agent]: " APP_NAME
APP_NAME=${APP_NAME:-teampulse-agent}

read -p "Enter Azure region [eastus]: " LOCATION
LOCATION=${LOCATION:-eastus}

read -p "Enter GitHub repository URL (e.g., https://github.com/username/repo): " REPO_URL

read -p "Enter branch name [main]: " BRANCH
BRANCH=${BRANCH:-main}

echo ""
echo "📦 Configuration:"
echo "  Resource Group: $RESOURCE_GROUP"
echo "  App Name: $APP_NAME"
echo "  Location: $LOCATION"
echo "  Repository: $REPO_URL"
echo "  Branch: $BRANCH"
echo ""

read -p "Continue with deployment? (y/n): " CONFIRM
if [ "$CONFIRM" != "y" ]; then
    echo "Deployment cancelled."
    exit 0
fi

echo ""
echo "🏗️  Creating resource group..."
az group create \
  --name "$RESOURCE_GROUP" \
  --location "$LOCATION"

echo ""
echo "☁️  Creating Azure Static Web App..."
echo "   This will prompt you to authorize GitHub access..."
echo ""

az staticwebapp create \
  --name "$APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --source "$REPO_URL" \
  --location "$LOCATION" \
  --branch "$BRANCH" \
  --app-location "/" \
  --output-location "dist" \
  --login-with-github

echo ""
echo "✅ Deployment initiated!"
echo ""

# Get the app URL
APP_URL=$(az staticwebapp show \
  --name "$APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --query "defaultHostname" -o tsv)

echo "🌐 Your app will be available at: https://$APP_URL"
echo ""
echo "📋 Next Steps:"
echo "  1. Wait for GitHub Actions to complete the build (check your repository)"
echo "  2. Update Azure AD redirect URI to: https://$APP_URL"
echo "  3. Add environment variables in Azure Portal:"
echo "     - Go to: https://portal.azure.com"
echo "     - Navigate to: $APP_NAME → Configuration"
echo "     - Add your VITE_* environment variables"
echo "  4. Trigger a redeploy by pushing to your repository"
echo ""
echo "📖 For detailed instructions, see AZURE_DEPLOYMENT.md"
echo ""
echo "🎉 Deployment script completed!"

