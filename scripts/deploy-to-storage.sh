#!/bin/bash

# TeamPulse Agent - Azure Storage Static Website Deployment
# This is the recommended alternative if Static Web Apps is not available

set -e

echo "🚀 TeamPulse Agent - Azure Storage Deployment"
echo "=============================================="
echo ""

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo "❌ Azure CLI is not installed."
    echo "Please install it from: https://docs.microsoft.com/cli/azure/install-azure-cli"
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

read -p "Enter storage account name (lowercase, no special chars) [teampulsestorage]: " STORAGE_ACCOUNT
STORAGE_ACCOUNT=${STORAGE_ACCOUNT:-teampulsestorage}

read -p "Enter Azure region [eastus]: " LOCATION
LOCATION=${LOCATION:-eastus}

echo ""
echo "📦 Configuration:"
echo "  Resource Group: $RESOURCE_GROUP"
echo "  Storage Account: $STORAGE_ACCOUNT"
echo "  Location: $LOCATION"
echo ""

read -p "Continue with deployment? (y/n): " CONFIRM
if [ "$CONFIRM" != "y" ]; then
    echo "Deployment cancelled."
    exit 0
fi

echo ""
echo "🏗️  Creating resource group (if it doesn't exist)..."
az group create \
  --name "$RESOURCE_GROUP" \
  --location "$LOCATION" \
  --output none

echo ""
echo "💾 Creating storage account..."
az storage account create \
  --name "$STORAGE_ACCOUNT" \
  --resource-group "$RESOURCE_GROUP" \
  --location "$LOCATION" \
  --sku Standard_LRS \
  --kind StorageV2 \
  --output none

echo ""
echo "🌐 Enabling static website hosting..."
az storage blob service-properties update \
  --account-name "$STORAGE_ACCOUNT" \
  --static-website \
  --404-document index.html \
  --index-document index.html \
  --output none

echo ""
echo "🔨 Building application..."
npm run build

if [ ! -d "dist" ]; then
    echo "❌ Build failed - dist folder not found"
    exit 1
fi

echo ""
echo "🔑 Getting storage account key..."
STORAGE_KEY=$(az storage account keys list \
  --account-name "$STORAGE_ACCOUNT" \
  --resource-group "$RESOURCE_GROUP" \
  --query '[0].value' -o tsv)

echo ""
echo "📤 Uploading files to Azure Storage..."
az storage blob upload-batch \
  --account-name "$STORAGE_ACCOUNT" \
  --account-key "$STORAGE_KEY" \
  --source ./dist \
  --destination '$web' \
  --overwrite \
  --output none

echo ""
echo "🌍 Getting website URL..."
WEBSITE_URL=$(az storage account show \
  --name "$STORAGE_ACCOUNT" \
  --resource-group "$RESOURCE_GROUP" \
  --query "primaryEndpoints.web" \
  --output tsv)

# Remove trailing slash
WEBSITE_URL=${WEBSITE_URL%/}

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Deployment Successful!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 Your app is now live at:"
echo "   $WEBSITE_URL"
echo ""
echo "📋 Important Next Steps:"
echo ""
echo "1️⃣  Update Azure AD Redirect URI:"
echo "   - Go to: https://portal.azure.com"
echo "   - Navigate to: Azure Active Directory → App registrations"
echo "   - Select your TeamPulse app"
echo "   - Go to: Authentication"
echo "   - Add redirect URI: $WEBSITE_URL"
echo "   - Save changes"
echo ""
echo "2️⃣  If using Azure OpenAI:"
echo "   - Rebuild with production environment variables"
echo "   - Create .env.production with your production URL"
echo "   - Run: npm run build"
echo "   - Redeploy: ./deploy-to-storage.sh"
echo ""
echo "3️⃣  Test Your Application:"
echo "   - Open: $WEBSITE_URL"
echo "   - Test sign-in with Microsoft account"
echo "   - Verify all features work"
echo ""
echo "💡 Tip: To update your app, just run this script again!"
echo ""
echo "📖 For more details, see: AZURE_DEPLOYMENT_ALTERNATIVES.md"
echo ""
