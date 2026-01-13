/**
 * OpenAI API Client
 * Handles communication with the backend API for OpenAI requests
 * Uses the Azure Functions API endpoint instead of direct OpenAI calls
 */

class OpenAIApiClient {
  constructor() {
    // In production (Static Web Apps), API is at /api
    // In development, Vite proxy will forward /api to http://localhost:7071
    this.baseUrl = '/api';
  }

  /**
   * Generate a chat completion using Azure OpenAI via the backend API
   * @param {Object} options - Chat completion options
   * @param {Array} options.messages - Array of message objects with role and content
   * @param {string} options.model - Model/deployment name to use
   * @param {number} [options.temperature=0.3] - Sampling temperature
   * @param {number} [options.max_tokens=1500] - Maximum tokens to generate
   * @param {number} [options.presence_penalty=0.3] - Presence penalty
   * @param {number} [options.frequency_penalty=0.3] - Frequency penalty
   * @returns {Promise<Object>} - The completion response
   */
  async createChatCompletion(options) {
    const {
      messages,
      model,
      temperature = 0.3,
      max_tokens = 1500,
      presence_penalty = 0.3,
      frequency_penalty = 0.3
    } = options;

    // Validate required fields
    if (!messages || !Array.isArray(messages)) {
      throw new Error('messages array is required');
    }

    if (!model) {
      throw new Error('model is required');
    }

    try {
      const response = await fetch(`${this.baseUrl}/generateSummary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages,
          model,
          temperature,
          max_tokens,
          presence_penalty,
          frequency_penalty
        })
      });

      if (!response.ok) {
        // Parse error response
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { error: 'Unknown error occurred' };
        }

        // Log detailed error information for debugging
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.error('API ERROR DETAILS:');
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.error('Status:', response.status);
        console.error('Status Text:', response.statusText);
        console.error('Error Message:', errorData.error);
        console.error('Error Code:', errorData.code);
        console.error('Error Details:', errorData.details);
        console.error('Error Stack:', errorData.stack);
        console.error('Full Error Data:', JSON.stringify(errorData, null, 2));
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        // Create error object with details
        const error = new Error(errorData.error || `API request failed with status ${response.status}`);
        error.status = response.status;
        error.code = errorData.code;
        error.details = errorData.details;
        
        // Map error codes for compatibility with existing error handling
        if (errorData.code) {
          error.code = errorData.code;
        }
        
        throw error;
      }

      const data = await response.json();
      return data;

    } catch (error) {
      // Re-throw network or parsing errors
      if (error.message && !error.status) {
        const networkError = new Error(`Network error: ${error.message}`);
        networkError.code = 'network_error';
        throw networkError;
      }
      throw error;
    }
  }

  /**
   * Check if the API is available
   * @returns {Promise<boolean>}
   */
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseUrl}/generateSummary`, {
        method: 'OPTIONS'
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const openAIClient = new OpenAIApiClient();

// Also export the class for testing or custom instances
export default OpenAIApiClient;
