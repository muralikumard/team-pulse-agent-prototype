# Getting Started with TeamPulse Agent

Complete setup guide for Azure AD authentication and Azure OpenAI integration.

---

## Quick Start Overview

TeamPulse Agent requires:
1. **Azure AD** - For secure authentication (Required)
2. **Azure OpenAI** - For AI summaries (Optional)
3. **API Layer** - For secure OpenAI access with Managed Identity (Optional, recommended for AI features)

---

## 1. Azure Active Directory Setup

### Prerequisites
- Azure subscription with admin access
- Permissions to register applications

### Step 1: Register Application

1. Navigate to [Azure Portal](https://portal.azure.com)
2. Go to **Azure Active Directory** → **App registrations**
3. Click **"New registration"**
   - **Name**: `TeamPulse Agent`
   - **Supported account types**: "Accounts in this organizational directory only"
   - **Redirect URI**: 
     - Platform: `Single-page application (SPA)`
     - URI: `http://localhost:5174`
   - Click **"Register"**

4. **Copy these values** (you'll need them):
   - Application (client) ID
   - Directory (tenant) ID

### Step 2: Configure Authentication

1. Go to **Authentication** in the left sidebar
2. Under "Implicit grant and hybrid flows":
   - ✅ Check **"Access tokens"**
   - ✅ Check **"ID tokens"**
3. Click **"Save"**

### Step 3: Configure API Permissions

1. Go to **API Permissions**
2. Verify `User.Read` (Microsoft Graph) is present
3. Click **"Grant admin consent"** if required by your organization

### Step 4: Configure Your Application

Create `.env.local` in your project root:

```env
VITE_AZURE_CLIENT_ID=your-client-id-here
VITE_AZURE_AUTHORITY=https://login.microsoftonline.com/your-tenant-id-here
VITE_REDIRECT_URI=http://localhost:5174
VITE_POST_LOGOUT_REDIRECT_URI=http://localhost:5174
```

### Step 5: Test Authentication

```bash
npm install
npm run dev
```

Open http://localhost:5174 and test sign-in.

---

## 2. Azure OpenAI Setup (Optional)

Enable AI-powered summary generation.

### Prerequisites
- Azure subscription
- Access to Azure OpenAI Service (may require application approval)

### Step 1: Create Azure OpenAI Resource

1. In Azure Portal, click **"Create a resource"**
2. Search for **"Azure OpenAI"** and click **"Create"**
3. Configure:
   - **Resource group**: `rg-teampulse` (or existing)
   - **Region**: East US or available region
   - **Name**: `teampulse-openai` (must be unique)
   - **Pricing tier**: Standard S0
4. Click **"Review + Create"** → **"Create"**

### Step 2: Deploy a Model

1. Go to [Azure OpenAI Studio](https://oai.azure.com)
2. Select your resource
3. Navigate to **Deployments** → **"Create new deployment"**
4. Configure:
   - **Model**: `gpt-4o` or `gpt-35-turbo`
   - **Deployment name**: `gpt-4o` (note this name)
   - Click **"Create"**

### Step 3: Get Credentials

1. In Azure Portal, go to your OpenAI resource
2. Copy the **Endpoint** (e.g., `https://teampulse-openai.openai.azure.com/`)
3. Go to **"Keys and Endpoint"** → copy **Key 1**

---

## 3. Choose Your Deployment Method

### Option A: API Layer with Managed Identity (Recommended)

**Most secure** - API keys never exposed to client.

1. Deploy to Azure Static Web Apps
2. Follow [API Setup Guide](API_SETUP.md) to:
   - Enable Managed Identity
   - Grant OpenAI access
   - Deploy API Functions

**No additional environment variables needed** - configuration is server-side.

### Option B: Direct Client Integration (Quick Testing)

**For local development only** - not recommended for production.

Add to your `.env.local`:

```env
VITE_AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
VITE_AZURE_OPENAI_API_KEY=your-api-key-here
VITE_AZURE_OPENAI_API_VERSION=2024-10-21
```

⚠️ **Warning**: API keys are exposed in the browser. Use only for local testing.

---

## 4. Deploy Your Application

Choose your deployment method:

### Azure Storage (Recommended - Cheapest)

```bash
./scripts/deploy-to-storage.sh
```

**Cost**: ~$0.01-0.10/month  
**Best for**: Simple hosting without API layer

### Azure Static Web Apps (Recommended for API)

```bash
./scripts/deploy-to-azure.sh
```

**Cost**: Free tier available  
**Best for**: API layer with Managed Identity

See [Deployment Guide](DEPLOYMENT.md) for detailed instructions.

---

## 5. Post-Deployment Configuration

### Update Azure AD Redirect URIs

1. Go to Azure Portal → App registrations → Your app
2. Go to **Authentication**
3. Add your production URL:
   - Storage: `https://your-storage-account.z13.web.core.windows.net`
   - Static Web Apps: `https://your-app.azurestaticapps.net`
4. Click **"Save"**

### Test Your Deployment

1. Navigate to your deployed URL
2. Sign in with Microsoft account
3. Add a test accomplishment
4. Generate a summary (if OpenAI configured)

---

## Next Steps

- **[API Setup Guide](API_SETUP.md)** - Set up API layer with Managed Identity
- **[Deployment Guide](DEPLOYMENT.md)** - Detailed deployment options
- **[Troubleshooting](TROUBLESHOOTING.md)** - Common issues and solutions

---

## Security Best Practices

✅ **Do:**
- Use Managed Identity for OpenAI access in production
- Store secrets in Azure Key Vault or Application Settings
- Enable HTTPS for production deployments
- Regularly rotate API keys (if using direct integration)

❌ **Don't:**
- Commit API keys to source control
- Expose OpenAI keys in client-side code
- Use development credentials in production
- Share tenant IDs or client secrets publicly

---

## Cost Estimate

| Component | Monthly Cost | Notes |
|-----------|--------------|-------|
| Azure AD | Free | Included with Microsoft 365 |
| Azure Storage | $0.01-0.10 | Static website hosting |
| Azure OpenAI | $0.50-5 | Usage-based (optional) |
| Azure Functions | Free-$0.50 | API layer (optional) |

**Total**: ~$0.01-0.10/month without AI, ~$0.50-5/month with AI

---

## Support

- 📚 Check [Troubleshooting Guide](TROUBLESHOOTING.md)
- 📖 Review [Azure Setup Documentation](https://docs.microsoft.com/azure/)
- 🔍 Search existing issues on GitHub
