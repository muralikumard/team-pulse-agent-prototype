# Azure Functions API Configuration

This folder contains the Azure Functions API that serves as a secure backend for the TeamPulse application.

## Architecture

The API acts as a proxy between the frontend and Azure OpenAI, using Managed Identity for secure authentication:

```
Frontend (React/Vite) → Azure Function → Azure OpenAI (via Managed Identity)
```

## Key Features

- **Managed Identity Authentication**: Uses Azure Managed Identity to securely connect to Azure OpenAI without exposing API keys to the client
- **API Key Support**: Supports API key authentication for local development
- **Serverless**: Runs as Azure Functions, automatically scales with demand
- **Integrated with Static Web Apps**: Deploys alongside the frontend for seamless integration

## File Structure

```
api/
├── src/
│   └── functions/
│       └── generateSummary.js    # OpenAI proxy endpoint
├── package.json                   # Dependencies
├── host.json                      # Functions runtime config
├── local.settings.json            # Local development config (gitignored)
└── README.md                      # This file
```

## Environment Variables

The following environment variables need to be configured in Azure:

- `AZURE_OPENAI_ENDPOINT`: Your Azure OpenAI endpoint URL (e.g., https://your-resource.openai.azure.com)
- `AZURE_OPENAI_DEPLOYMENT_NAME`: The name of your OpenAI deployment (e.g., gpt-4o)
- `AZURE_OPENAI_API_VERSION`: API version to use (default: 2025-01-01-preview)

## Local Development

1. Install Azure Functions Core Tools globally (if not already installed):
   ```bash
   npm install -g azure-functions-core-tools@4 --unsafe-perm true
   ```

2. Install API dependencies:
   ```bash
   cd api
   npm install
   ```

3. Configure local settings in `local.settings.json` (this file is gitignored):
   ```json
   {
     "IsEncrypted": false,
     "Values": {
       "FUNCTIONS_WORKER_RUNTIME": "node",
       "AZURE_OPENAI_ENDPOINT": "your-endpoint",
       "AZURE_OPENAI_DEPLOYMENT_NAME": "your-deployment",
       "AZURE_OPENAI_API_VERSION": "2025-01-01-preview",
       "AZURE_OPENAI_API_KEY": "your-api-key-for-local-dev"
     }
   }
   ```
   
   **For local development**, you can use either:
   - **API Key**: Add `AZURE_OPENAI_API_KEY` (easier for local testing)
   - **Managed Identity**: Run `az login` and the API will use your Azure credentials

3. Login to Azure (required for Managed Identity authentication):
   ```bash
   az login
   ```

4. Start the Functions runtime:
   ```bash
   npm start
   ```

4. The API will be available at `http://localhost:7071/api/generateSummary`

## Endpoints

### POST /api/generateSummary

Generates an AI summary using Azure OpenAI.

**Request Body:**
```json
{
  "messages": [
    {"role": "system", "content": "You are a helpful assistant"},
    {"role": "user", "content": "Summarize this..."}
  ],
  "model": "gpt-4o",
  "temperature": 0.3,
  "max_tokens": 1500,
  "presence_penalty": 0.3,
  "frequency_penalty": 0.3
}
```

**Response:**
```json
{
  "choices": [
    {
      "message": {
        "content": "AI-generated summary..."
      }
    }
  ],
  "model": "gpt-4o",
  "usage": {...}
}
```

## Deployment

When deployed to Azure Static Web Apps, the API is automatically available at `/api/*` paths. The managed identity needs to be configured with appropriate RBAC roles for Azure OpenAI access.

See the main deployment documentation for full setup instructions.
