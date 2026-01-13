# API Package Fix

## Issue
The original `api/package.json` had an incorrect dependency:
- `@azure/functions-core-tools` - This package doesn't exist in npm registry

## Fix Applied

### 1. Updated package.json
**Removed:**
- `@azure/functions-core-tools` from devDependencies (this tool is installed globally, not as a project dependency)
- `@azure/openai` package (beta version)

**Changed to:**
- `openai` package (stable version ^4.0.0) which supports Azure OpenAI

### 2. Updated generateSummary.js
- Changed import from `@azure/openai` to `openai`
- Updated client initialization to use token-based authentication
- Now properly gets Azure AD token from Managed Identity/DefaultAzureCredential
- Uses token as API key for Azure OpenAI client

### 3. Updated Documentation
- Added clear instruction to install Azure Functions Core Tools globally
- Added `az login` step before starting the API locally

## How to Install and Run

### First Time Setup
```bash
# Install Azure Functions Core Tools globally (one-time)
npm install -g azure-functions-core-tools@4 --unsafe-perm true

# Install API dependencies
cd api
npm install
```

### Run Locally
```bash
# Login to Azure (for credential authentication)
az login

# Start the API
cd api
npm start
```

The API will be available at `http://localhost:7071/api/generateSummary`

## Why These Changes?

1. **@azure/functions-core-tools doesn't exist** - Azure Functions Core Tools is distributed as `azure-functions-core-tools` and should be installed globally, not as a project dependency.

2. **Using stable OpenAI SDK** - The `openai` package (v4+) has stable support for Azure OpenAI and works well with Azure AD token authentication.

3. **Token-based authentication** - We get an Azure AD token from Managed Identity (or DefaultAzureCredential for local dev) and use it as the API key. This is the recommended approach for Azure OpenAI with Managed Identity.

## Testing

After running `npm install` successfully, you can test the API:

```bash
# Start the API
npm start

# In another terminal, test it
curl -X POST http://localhost:7071/api/generateSummary \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Say hello"}
    ],
    "model": "gpt-4o"
  }'
```

## Dependencies Now Installed

```json
{
  "dependencies": {
    "@azure/functions": "^4.0.0",      // Azure Functions runtime
    "@azure/identity": "^4.0.0",        // Managed Identity support
    "openai": "^4.0.0"                  // OpenAI SDK with Azure support
  }
}
```

All dependencies are now correctly specified and should install without errors.
