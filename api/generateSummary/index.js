const { AzureOpenAI } = require('openai');
const { ManagedIdentityCredential } = require('@azure/identity');

/**
 * Azure Function that proxies OpenAI chat completion requests
 * Uses Managed Identity for secure authentication to Azure OpenAI
 */
module.exports = async function (context, req) {
    context.log('OpenAI proxy function triggered');
    context.log('Environment variables:', {
        hasEndpoint: !!process.env.AZURE_OPENAI_ENDPOINT,
        hasDeployment: !!process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
        hasMSI_ENDPOINT: !!process.env.MSI_ENDPOINT,
        hasMSI_SECRET: !!process.env.MSI_SECRET,
        hasIDENTITY_ENDPOINT: !!process.env.IDENTITY_ENDPOINT,
        hasIDENTITY_HEADER: !!process.env.IDENTITY_HEADER
    });
        
    try {
        // Parse request body
        const requestBody = req.body;
        const { messages, model, temperature, max_tokens, presence_penalty, frequency_penalty } = requestBody;

        // Validate required fields
        if (!messages || !Array.isArray(messages)) {
            context.res = {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
                body: {
                    error: 'Invalid request: messages array is required'
                }
            };
            return;
        }

        if (!model) {
            context.res = {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
                body: {
                    error: 'Invalid request: model is required'
                }
            };
            return;
        }

        // Get Azure OpenAI configuration from environment variables
        const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
        const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || model;
        const apiVersion = process.env.AZURE_OPENAI_API_VERSION || '2025-01-01-preview';
        
        context.log('Azure OpenAI Configuration:', {
            endpoint: endpoint,
            deploymentName: deploymentName,
            requestedModel: model,
            apiVersion: apiVersion
        });
        const apiKey = process.env.AZURE_OPENAI_API_KEY; // For local development
        
        if (!endpoint) {
            context.log.error('AZURE_OPENAI_ENDPOINT is not configured');
            context.res = {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
                body: {
                    error: 'Server configuration error: OpenAI endpoint not configured'
                }
            };
            return;
        }

        // Initialize Azure OpenAI client
        let client;
        
        if (apiKey) {
            // Use API key if provided (local development)
            context.log('Using API key for authentication');
            client = new AzureOpenAI({
                apiKey: apiKey,
                endpoint: endpoint,
                apiVersion: apiVersion
            });
        } else {
            // Use Managed Identity (production)
            context.log('Using Managed Identity for authentication');
            
            try {
                // Create a custom token provider that handles the Managed Identity token
                const getAccessToken = async () => {
                    const credential = new ManagedIdentityCredential({
                        clientId: process.env.AZURE_CLIENT_ID
                    });
                    
                    context.log('Attempting to get token from Managed Identity...');
                    const tokenResponse = await credential.getToken('https://cognitiveservices.azure.com/.default');
                    
                    if (!tokenResponse || !tokenResponse.token) {
                        throw new Error('Failed to get token from Managed Identity');
                    }
                    
                    context.log('Successfully obtained token from Managed Identity');
                    return tokenResponse.token;
                };

                // Create a token provider function that returns a promise
                const azureADTokenProvider = async () => {
                    return await getAccessToken();
                };

                client = new AzureOpenAI({
                    endpoint: endpoint,
                    apiVersion: apiVersion,
                    azureADTokenProvider: azureADTokenProvider
                });
                
                context.log('Successfully initialized OpenAI client with Managed Identity');
            } catch (authError) {
                context.log.error('Managed Identity authentication error:', authError);
                context.log.error('Full error:', JSON.stringify(authError, null, 2));
                throw new Error(`Managed Identity authentication failed: ${authError.message}`);
            }
        }

        context.log(`Calling Azure OpenAI with deployment: ${deploymentName}`);

        context.log(`Calling Azure OpenAI with model: ${deploymentName}`);

        // Call Azure OpenAI
        const completion = await client.chat.completions.create({
            messages: messages,
            model: deploymentName,
            temperature: temperature || 0.3,
            max_tokens: max_tokens || 1500,
            presence_penalty: presence_penalty || 0.3,
            frequency_penalty: frequency_penalty || 0.3
        });

        context.log('Successfully received response from Azure OpenAI');

        // Return the completion response
        context.res = {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                choices: completion.choices,
                model: completion.model,
                usage: completion.usage
            }
        };

    } catch (error) {
        context.log.error('Error in OpenAI proxy function:', error);
        context.log.error('Error stack:', error.stack);
        context.log.error('Error details:', JSON.stringify(error, null, 2));
        
        let statusCode = 500;
        let errorMessage = 'Internal server error while calling OpenAI';
        let errorCode = 'internal_error';

        // Handle authentication errors
        if (error.message && error.message.includes('Managed Identity')) {
            statusCode = 500;
            errorMessage = 'Managed Identity authentication failed. Check role assignments.';
            errorCode = 'auth_error';
        } else if (error.message && error.message.includes('getToken')) {
            statusCode = 500;
            errorMessage = 'Failed to acquire authentication token';
            errorCode = 'auth_error';
        } else if (error.code === 'insufficient_quota' || error.code === 'quota_exceeded') {
            statusCode = 429;
            errorMessage = 'Azure OpenAI quota has been exceeded';
            errorCode = error.code;
        } else if (error.code === 'rate_limit_exceeded') {
            statusCode = 429;
            errorMessage = 'Rate limit exceeded for Azure OpenAI API';
            errorCode = error.code;
        } else if (error.code === 'context_length_exceeded') {
            statusCode = 413;
            errorMessage = 'The input was too long for Azure OpenAI to process';
            errorCode = error.code;
        } else if (error.status) {
            statusCode = error.status;
            errorMessage = error.message || errorMessage;
        }

        context.res = {
            status: statusCode,
            headers: { 'Content-Type': 'application/json' },
            body: {
                error: errorMessage,
                code: errorCode,
                details: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            }
        };
    }
};
