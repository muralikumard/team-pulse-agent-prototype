// Azure OpenAI Configuration
export const azureOpenAIConfig = {
  // Replace these with your actual Azure OpenAI service values
  endpoint: 'https://your-resource-name.openai.azure.com', // Replace 'your-resource-name' with your actual resource name
  apiVersion: '2025-01-01-preview', // Updated to latest stable API version for Azure OpenAI SDK 2.0.0
  
  // Azure deployment names (replace with your actual deployment names)
  deployments: {
    'gpt-4.1': 'gpt-4.1' // GPT-4.1 deployment name
  }
}

// Note: To set up Azure OpenAI:
// 1. Create an Azure OpenAI resource in the Azure portal
// 2. Deploy the gpt-4.1 model with the deployment name 'gpt-4.1'
// 3. Get your API key and endpoint from the Azure portal
// 4. Update the values above with your actual Azure OpenAI details

