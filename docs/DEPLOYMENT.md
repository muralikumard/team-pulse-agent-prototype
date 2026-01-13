# TeamPulse Agent - Deployment Guide

Complete guide for deploying TeamPulse Agent to Microsoft Azure.

---

## Table of Contents

- [Quick Start](#quick-start)
- [Deployment Options](#deployment-options)
- [Azure Storage (Recommended)](#azure-storage-recommended)
- [Azure Static Web Apps](#azure-static-web-apps)
- [Azure App Service](#azure-app-service)
- [Manual Deployment (No GitHub Actions)](#manual-deployment-no-github-actions)
- [Post-Deployment Setup](#post-deployment-setup)
- [Troubleshooting](#troubleshooting)

---

## Quick Start

### For Organizations with GitHub Actions Enabled

**Azure Storage (Recommended - Cheapest & Easiest)**
```bash
./scripts/deploy-to-storage.sh
```

**Azure Static Web Apps**
```bash
./scripts/deploy-to-azure.sh
```

### For Organizations with GitHub Actions Disabled

See [Manual Deployment](#manual-deployment-no-github-actions) section below.

---

## Deployment Options

| Method | Cost/Month | Difficulty | Best For | GitHub Actions Required |
|--------|-----------|-----------|----------|------------------------|
| **Azure Storage** ⭐ | $0.01-0.10 | Easy | Most users | No |
| **Static Web Apps** | Free-$9 | Easy | CI/CD automation | Yes |
| **App Service (Free)** | $0 | Easy | Testing (60 min/day) | No |
| **App Service (Basic)** | ~$13 | Medium | Production features | No |

---

## Azure Storage (Recommended)

Azure Storage Static Website is the **best option** for most deployments:
- ✅ Extremely cheap (~$0.01/month)
- ✅ Simple deployment
- ✅ No GitHub Actions required
- ✅ Built-in HTTPS/SSL
- ✅ Perfect for React SPAs

### First-Time Deployment

1. **Run the deployment script:**
   ```bash
   ./scripts/deploy-to-storage.sh
   ```

2. **Follow the prompts:**
   - Resource group name (default: `rg-teampulse`)
   - Storage account name (must be unique, lowercase, no special chars)
   - Azure region (default: `eastus`)

3. **Script will automatically:**
   - Create resource group
   - Create storage account
   - Enable static website hosting
   - Build your application (`npm run build` → `dist/`)
   - Upload all files
   - Provide your live URL

**Note:** Azure Storage only hosts the frontend. AI summary features require Azure Static Web Apps or App Service with the API layer. See [QUICK_START_API.md](QUICK_START_API.md) for API deployment options.

4. **Update Azure AD:**
   - Go to Azure Portal → Azure AD → App registrations
   - Select your app → Authentication
   - Add redirect URI with your storage URL
   - Save

### Updating Your App

After making code changes:
```bash
./scripts/deploy-update.sh
```

Provide your storage account name when prompted.

### Manual Steps (If Scripts Don't Work)

<details>
<summary>Click to expand manual deployment steps</summary>

#### 1. Create Storage Account

**Via Azure Portal:**
1. Go to [portal.azure.com](https://portal.azure.com)
2. Create resource → Storage account
3. Configuration:
   - Name: `teampulsestorage` (must be unique)
   - Performance: Standard
   - Redundancy: LRS
4. Create

#### 2. Enable Static Website

1. Storage Account → Static website
2. Enable it
3. Index document: `index.html`
4. Error document: `index.html`
5. Save and copy the "Primary endpoint" URL

#### 3. Build and Upload

**Build:**
```bash
npm run build
```

**Upload via Azure Portal:**
1. Storage Account → Storage browser
2. Blob containers → $web
3. Upload → Browse for files
4. Select ALL files from `dist/` folder
5. Upload

**Upload via Azure CLI:**
```bash
az storage blob upload-batch \
  --account-name teampulsestorage \
  --source ./dist \
  --destination '$web' \
  --overwrite
```

</details>

---

## Azure Static Web Apps

Best for teams with GitHub Actions enabled and want automatic CI/CD.

### Prerequisites
- GitHub repository
- GitHub Actions enabled
- Azure subscription
- Azure OpenAI resource (for AI summaries)

### Deployment

1. **Run the deployment script:**
   ```bash
   ./scripts/deploy-to-azure.sh
   ```

2. **Follow the prompts:**
   - Resource group name
   - Static Web App name
   - Region
   - GitHub repository URL
   - Branch name

3. **Configure environment variables:**
   - Go to Azure Portal → Your Static Web App → Configuration
   - Add frontend application settings:
     - `VITE_AZURE_CLIENT_ID`
     - `VITE_AZURE_AUTHORITY`
     - `VITE_REDIRECT_URI`
     - `VITE_POST_LOGOUT_REDIRECT_URI`
   - Add API application settings (for AI summaries):
     - `AZURE_OPENAI_ENDPOINT` (e.g., https://your-resource.openai.azure.com)
     - `AZURE_OPENAI_DEPLOYMENT_NAME` (e.g., gpt-4o)
     - `AZURE_OPENAI_API_VERSION` (e.g., 2025-01-01-preview)

4. **Set up Managed Identity** (Required for API to access Azure OpenAI):
   ```bash
   # Enable managed identity
   az staticwebapp identity assign \
     --name <your-static-web-app-name> \
     --resource-group <your-resource-group>
   
   # Grant OpenAI access
   PRINCIPAL_ID=$(az staticwebapp identity show \
     --name <your-static-web-app-name> \
     --resource-group <your-resource-group> \
     --query principalId -o tsv)
   
   az role assignment create \
     --assignee $PRINCIPAL_ID \
     --role "Cognitive Services OpenAI User" \
     --scope /subscriptions/<sub-id>/resourceGroups/<rg>/providers/Microsoft.CognitiveServices/accounts/<openai-name>
   ```

5. **Update Azure AD redirect URIs** with your Static Web App URL

**Note:** The deployment automatically includes the Azure Functions API. See [API_MANAGED_IDENTITY_SETUP.md](API_MANAGED_IDENTITY_SETUP.md) for detailed API configuration.

### Manual Creation via Azure Portal

1. Go to [portal.azure.com](https://portal.azure.com)
2. Create resource → Static Web App
3. Configure:
   - Source: GitHub
   - Repository: Your repo
   - Branch: main
   - Build preset: React
   - App location: `/`
   - API location: `api`
   - Output location: `dist`
4. Review + Create

Azure will automatically:
- Add GitHub Actions workflow
- Deploy frontend and API on every push
- Provide production URL
- Make API available at `/api/*` paths

**Important:** After creation, configure Managed Identity and application settings as described above.

---

## Azure App Service

For more control and features like staging slots, custom runtimes, etc.

### Quick Deploy

**Via Azure Portal:**
1. Create resource → Web App
2. Configuration:
   - Runtime: Node 20 LTS
   - OS: Linux
   - Plan: Free F1 or Basic B1
3. Create

**Deploy via ZIP:**
```bash
npm run build
cd dist
zip -r ../deploy.zip .
cd ..

az webapp deployment source config-zip \
  --resource-group rg-teampulse \
  --name teampulse-agent \
  --src deploy.zip
```

The `web.config` file is automatically included in the build for proper SPA routing.

---

## Manual Deployment (No GitHub Actions)

If GitHub Actions is disabled in your organization:

### Option 1: Azure Storage (Recommended)

Use the automated scripts:

**First time:**
```bash
./scripts/deploy-to-storage.sh
```

**Updates:**
```bash
./scripts/deploy-update.sh
```

### Option 2: Azure Static Web Apps with SWA CLI

Install SWA CLI:
```bash
npm install -g @azure/static-web-apps-cli
```

Deploy:
```bash
npm run build

swa deploy ./dist \
  --app-name YOUR_APP_NAME \
  --api-location ./api \
  --api-language node \
  --api-version 20 \
  --deployment-token "YOUR_DEPLOYMENT_TOKEN"
```

**Note:** The `--api-location ./api` parameter ensures the Azure Functions API is deployed alongside the frontend. The `--api-language` and `--api-version` specify the Node.js runtime.

Get deployment token from: Azure Portal → Static Web App → Configuration

### Option 3: FTP Upload

1. Get FTP credentials from Azure Portal
2. Use FTP client (FileZilla, WinSCP, etc.)
3. Upload `dist/` folder contents to deployment path

---

## Post-Deployment Setup

After deploying to any platform:

### 1. Update Azure AD Configuration

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to Azure AD → App registrations
3. Select your TeamPulse app
4. Go to Authentication
5. Add redirect URI: `https://your-deployment-url`
6. Add post-logout redirect URI: `https://your-deployment-url`
7. Save

### 2. Configure Environment Variables

**For Vite/React apps, environment variables must be set BEFORE building.**

Create `.env.production`:
```env
VITE_AZURE_CLIENT_ID=your-client-id
VITE_AZURE_AUTHORITY=https://login.microsoftonline.com/your-tenant-id
VITE_REDIRECT_URI=https://your-deployment-url
VITE_POST_LOGOUT_REDIRECT_URI=https://your-deployment-url
VITE_AZURE_OPENAI_ENDPOINT=your-endpoint
VITE_AZURE_OPENAI_API_KEY=your-key
VITE_AZURE_OPENAI_API_VERSION=2024-10-21
```

Then rebuild and redeploy.

### 3. Test Your Deployment

1. Navigate to your deployment URL
2. Test sign-in with Microsoft account
3. Verify all features:
   - Add accomplishments
   - Edit/delete accomplishments
   - Filter by date
   - Generate AI summary (if configured)
4. Test on mobile devices

---

## Troubleshooting

### Build Issues

**"az: command not found"**
- Install Azure CLI: https://docs.microsoft.com/cli/azure/install-azure-cli

**Build fails locally**
- Run `npm install` first
- Delete `node_modules` and `package-lock.json`, then `npm install`
- Check Node.js version: `node --version` (should be 18+)

**Chunk size warning**
- This is just a warning, deployment will still work
- Already optimized with code splitting in `vite.config.js`

### Deployment Issues

**"Storage account name already taken"**
- Storage names must be globally unique
- Try: `teampulse` + your initials + random numbers

**"Resource not found"**
- Ensure you're logged into the correct Azure subscription
- Check subscription: `az account show`
- Switch if needed: `az account set --subscription <id>`

**Upload fails**
- Check storage account exists
- Verify you have permission
- Try re-running `az login`

### Authentication Issues

**"Redirect URI mismatch"**
- Ensure redirect URI in Azure AD exactly matches your deployment URL
- Must include `https://`
- No trailing slash

**"User not authenticated"**
- Clear browser cache and cookies
- Check that Azure AD app is configured correctly
- Verify redirect URIs are set in Azure AD

**CORS errors**
- For Storage: Configure CORS in Storage Account settings
- For App Service: CORS is usually not needed for SPAs

### Performance Issues

**Slow loading**
- Enable CDN for Storage Account
- Consider upgrading App Service tier
- Check browser dev tools for bottlenecks

**Large bundle size**
- Already optimized with code splitting
- Consider lazy loading routes if app grows

---

## Additional Resources

- **[Azure AD Setup](AZURE_SETUP.md)** - Configure authentication
- **[Azure OpenAI Setup](AZURE_SETUP.md#azure-openai)** - Enable AI summaries
- **[Project README](../README.md)** - Main project documentation

---

## Cost Management

### Azure Storage
- **Storage**: ~$0.02/GB/month
- **Bandwidth**: First 5GB free, then ~$0.087/GB
- **Typical cost for this app**: $0.01-0.10/month

### Azure Static Web Apps
- **Free tier**: 100GB bandwidth, good for most apps
- **Standard tier**: $9/month for custom domains, etc.

### Azure App Service
- **Free F1**: $0 (60 min/day limit, for testing only)
- **Basic B1**: ~$13/month (recommended for production)

### Tips to Minimize Costs
- Use Azure Storage for production (cheapest)
- Set up spending alerts in Azure
- Delete unused resources
- Use free tiers for development/testing

---

## Support

For issues or questions:
1. Check [Troubleshooting](#troubleshooting) section above
2. Review Azure documentation
3. Check Azure service health status
4. Contact your Azure administrator

---

**Last Updated**: December 2025
