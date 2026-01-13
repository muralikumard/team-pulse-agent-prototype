# API Layer Setup with Managed Identity

Complete guide for setting up the Azure Functions API layer with secure OpenAI access.

---

## Overview

The API layer provides secure OpenAI access without exposing API keys to clients:

```
Frontend (React/Vite) → Azure Functions API → Azure OpenAI (Managed Identity)
```

**Benefits:**
- ✅ No API keys exposed to clients
- ✅ Centralized access control and monitoring
- ✅ Serverless auto-scaling
- ✅ No credential management in code

---

## Prerequisites

- Azure Static Web Apps deployment (or Azure Functions resource)
- Azure OpenAI resource with deployed model
- Azure CLI installed locally
- Completed [Getting Started Guide](GETTING_STARTED.md)

---

## Quick Setup

### 1. Enable Managed Identity

```bash
# Set your variables
STATIC_WEB_APP_NAME="your-static-web-app-name"
RESOURCE_GROUP="your-resource-group"
OPENAI_RESOURCE_NAME="your-openai-resource-name"

# Enable system-assigned managed identity
az staticwebapp identity assign \
  --name $STATIC_WEB_APP_NAME \
  --resource-group $RESOURCE_GROUP

# Get the principal ID
PRINCIPAL_ID=$(az staticwebapp identity show \
  --name $STATIC_WEB_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --query principalId -o tsv)

echo "Principal ID: $PRINCIPAL_ID"
```

### 2. Grant OpenAI Access

```bash
# Grant the managed identity access to Azure OpenAI
az role assignment create \
  --assignee $PRINCIPAL_ID \
  --role "Cognitive Services OpenAI User" \
  --scope $(az cognitiveservices account show \
    --name $OPENAI_RESOURCE_NAME \
    --resource-group $RESOURCE_GROUP \
    --query id -o tsv)

echo "✅ Managed Identity configured successfully"
```

### 3. Configure Application Settings

```bash
# Set environment variables for the API
az staticwebapp appsettings set \
  --name $STATIC_WEB_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --setting-names \
    AZURE_OPENAI_ENDPOINT="https://your-openai-resource.openai.azure.com" \
    AZURE_OPENAI_DEPLOYMENT_NAME="gpt-4o" \
    AZURE_OPENAI_API_VERSION="2024-10-21"
```

### 4. Deploy API Functions

If using Azure Static Web Apps, the API is deployed automatically when you push to GitHub:

```bash
git add .
git commit -m "Deploy API layer"
git push
```

The GitHub Action will deploy both frontend and API.

---

## Local Development

### Setup

```bash
# Install Azure Functions Core Tools
npm install -g azure-functions-core-tools@4 --unsafe-perm true

# Install API dependencies
cd api
npm install
cd ..

# Login to Azure (for local Managed Identity simulation)
az login
```

### Configure Local Settings

Create or edit `api/local.settings.json`:

```json
{
  "IsEncrypted": false,
  "Values": {
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "AzureWebJobsStorage": "",
    "AZURE_OPENAI_ENDPOINT": "https://your-resource.openai.azure.com",
    "AZURE_OPENAI_DEPLOYMENT_NAME": "gpt-4o",
    "AZURE_OPENAI_API_VERSION": "2024-10-21",
    "AZURE_OPENAI_API_KEY": "your-local-dev-key"
  },
  "Host": {
    "CORS": "*",
    "CORSCredentials": false
  }
}
```

**Note**: For local development, you can use either:
- **API Key**: Set `AZURE_OPENAI_API_KEY` (easier for local testing)
- **Managed Identity**: Remove the API key and ensure `az login` is active

### Run Locally

**Terminal 1 - Start API:**
```bash
cd api
npm start
```

API runs on http://localhost:7071

**Terminal 2 - Start Frontend:**
```bash
npm run dev
```

Frontend runs on http://localhost:5174 and proxies `/api/*` to the API.

### Test the API

```bash
curl -X POST http://localhost:7071/api/generateSummary \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Say hello"}
    ],
    "model": "gpt-4o",
    "temperature": 0.7
  }'
```

---

## Deployment Options

### Option 1: Azure Static Web Apps (Recommended)

The `api/` folder is automatically deployed with your frontend.

**Configuration in GitHub Actions:**
```yaml
api_location: "api"
```

See [Deployment Guide](DEPLOYMENT.md) for details.

### Option 2: Standalone Azure Functions

Deploy the API separately:

```bash
cd api
func azure functionapp publish <your-function-app-name>
```

Update frontend to point to your Function App URL.

---

## API Reference

### POST /api/generateSummary

Generate AI summaries using Azure OpenAI.

**Request Body:**
```json
{
  "messages": [
    {"role": "system", "content": "You are a helpful assistant"},
    {"role": "user", "content": "Create a summary"}
  ],
  "model": "gpt-4o",
  "temperature": 0.7,
  "max_tokens": 1500
}
```

**Response:**
```json
{
  "id": "chatcmpl-...",
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "Generated summary..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 50,
    "completion_tokens": 100,
    "total_tokens": 150
  }
}
```

**Error Response:**
```json
{
  "error": {
    "code": "rate_limit_exceeded",
    "message": "Rate limit exceeded"
  }
}
```

---

## Security Configuration

### Role-Based Access Control (RBAC)

The Managed Identity requires the following role:
- **Cognitive Services OpenAI User** - Allows making API calls to OpenAI

### Verify Permissions

```bash
# List role assignments for the managed identity
az role assignment list \
  --assignee $PRINCIPAL_ID \
  --all
```

### Grant Additional Users Access

To allow other identities to use OpenAI:

```bash
# For a user
az role assignment create \
  --assignee user@yourdomain.com \
  --role "Cognitive Services OpenAI User" \
  --scope /subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/Microsoft.CognitiveServices/accounts/{openai-resource}

# For another managed identity
az role assignment create \
  --assignee {principal-id} \
  --role "Cognitive Services OpenAI User" \
  --scope {openai-resource-id}
```

---

## Monitoring and Logging

### View Function Logs

**Azure Portal:**
1. Go to your Static Web App or Function App
2. Navigate to **Monitoring** → **Logs**
3. Query application logs

**Azure CLI:**
```bash
az monitor log-analytics query \
  --workspace {workspace-id} \
  --analytics-query "traces | where message contains 'generateSummary'"
```

### Monitor OpenAI Usage

1. Go to Azure Portal → Your OpenAI resource
2. Navigate to **Metrics**
3. View:
   - Total calls
   - Token usage
   - Latency
   - Error rates

---

## Troubleshooting

### Error: "Missing AZURE_OPENAI_ENDPOINT configuration"

**Solution**: Set the application settings:
```bash
az staticwebapp appsettings set --name $STATIC_WEB_APP_NAME --setting-names AZURE_OPENAI_ENDPOINT="https://your-resource.openai.azure.com"
```

### Error: "Authentication failed"

**Causes:**
- Managed Identity not enabled
- RBAC role not assigned
- Incorrect OpenAI endpoint

**Solution**: Verify setup:
```bash
# Check managed identity is enabled
az staticwebapp identity show --name $STATIC_WEB_APP_NAME --resource-group $RESOURCE_GROUP

# Verify role assignment
az role assignment list --assignee $PRINCIPAL_ID
```

### Error: "CORS policy" in browser

**For local development**, ensure `api/local.settings.json` has:
```json
"Host": {
  "CORS": "*"
}
```

**For production**, CORS is handled automatically by Static Web Apps.

### API returns 404

**Check:**
1. API folder is in the correct location (`/api`)
2. GitHub Actions deployment includes the API
3. Function name matches the route (`generateSummary`)

---

## Performance Optimization

### Caching

Consider implementing caching for repeated requests:

```javascript
// In generateSummary function
const cacheKey = hashRequest(messages);
const cached = await getCachedResponse(cacheKey);
if (cached) return cached;

// Make OpenAI call
const response = await client.getChatCompletions(...);

// Cache the response
await cacheResponse(cacheKey, response);
```

### Timeout Configuration

Adjust function timeout in `host.json`:

```json
{
  "functionTimeout": "00:05:00"
}
```

### Connection Pooling

The OpenAI client automatically manages connections. No additional configuration needed.

---

## Cost Management

### Monitor Costs

- View Azure OpenAI costs in Azure Portal → Cost Management
- Set up budget alerts
- Monitor token usage in Application Insights

### Optimize Usage

- Use `gpt-35-turbo` for cost-effective summaries
- Implement request rate limiting
- Cache frequent queries
- Set appropriate `max_tokens` limits

---

## Migration from Direct Client Access

If you previously used direct OpenAI client access:

1. **Remove** environment variables from `.env.local`:
   - `VITE_AZURE_OPENAI_ENDPOINT`
   - `VITE_AZURE_OPENAI_API_KEY`

2. **Update** `App.jsx` to use the API client (already done)

3. **Deploy** the API layer following this guide

4. **Test** the application to ensure AI summaries work

See [Migration Guide Archive](ARCHIVE.md#migration-to-api-layer) for detailed changes.

---

## Next Steps

- [Deployment Guide](DEPLOYMENT.md) - Deploy your application
- [Troubleshooting](TROUBLESHOOTING.md) - Common issues
- [Azure Functions Documentation](https://docs.microsoft.com/azure/azure-functions/)
- [Azure OpenAI Documentation](https://docs.microsoft.com/azure/cognitive-services/openai/)
