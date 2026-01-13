// Azure Active Directory (MSAL) Configuration
export const msalConfig = {
  auth: {
    clientId: 'your-client-id-here', // Replace with your Azure AD Application (client) ID
    authority: 'https://login.microsoftonline.com/your-tenant-id-here', // Replace 'your-tenant-id-here' with your Directory (tenant) ID
    redirectUri: 'localhost-or-deployedapp-url', // Must match the redirect URI in your Azure AD app registration
  },
  cache: {
    cacheLocation: 'sessionStorage', // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set to true if you have issues on IE11 or Edge
  },
};

// Check if Azure AD is properly configured
export const isAzureAdConfigured = 
  msalConfig.auth.clientId !== 'your-client-id-here' && 
  !msalConfig.auth.authority.includes('your-tenant-id-here');

// Scopes for login request
export const loginRequest = {
  scopes: ['User.Read'], // Default scope to read user profile
};

// Microsoft Graph API endpoints
export const graphConfig = {
  graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me', // Endpoint to get user profile information
};

// Helper function to get user-friendly error messages
export const getAuthErrorMessage = (error) => {
  if (!error) return 'An unknown error occurred';
  
  // Handle MSAL error codes
  if (error.errorCode) {
    switch (error.errorCode) {
      case 'user_cancelled':
        return 'Sign-in was cancelled. Please try again.';
      case 'consent_required':
        return 'Additional consent is required. Please sign in again.';
      case 'interaction_required':
        return 'Interaction is required. Please sign in again.';
      case 'login_required':
        return 'You need to sign in to continue.';
      case 'popup_window_error':
        return 'Pop-up window was blocked. Please allow pop-ups and try again.';
      case 'network_error':
        return 'Network error occurred. Please check your connection and try again.';
      default:
        return `Authentication error: ${error.errorCode}`;
    }
  }
  
  // Handle general errors
  if (error.message) {
    return error.message;
  }
  
  return 'An error occurred during authentication';
};

// Note: To set up Azure AD authentication:
// 1. Register an application in Azure Active Directory
// 2. Configure it as a Single-page application (SPA)
// 3. Add redirect URI: http://localhost:5174 (and your production URL when deploying)
// 4. Get your Client ID and Tenant ID from the Azure portal
// 5. Update the values above with your actual Azure AD details
// 
// For detailed setup instructions, see AZURE_AD_SETUP.md
