# Troubleshooting Guide

Common issues and solutions for TeamPulse Agent.

---

## Quick Links

- [Getting Started Guide](GETTING_STARTED.md) - Setup instructions
- [API Setup Guide](API_SETUP.md) - API layer configuration
- [Deployment Guide](DEPLOYMENT.md) - Deployment help

---

## Common Issues and Solutions

### 1. Import Errors

#### Error: "The requested module does not provide an export named 'AccountInfo'"
**Solution**: This error occurs when importing TypeScript types in JavaScript files. 

✅ **Fixed**: Removed the `AccountInfo` import from `AuthContext.jsx` since it's a TypeScript type, not a runtime export.

#### Error: "Cannot resolve module '@azure/msal-browser'"
**Solution**: Install the required dependencies:
```bash
npm install @azure/msal-browser @azure/msal-react
```

### 2. Configuration Issues

#### Error: "AADSTS50011: The reply URL does not match"
**Cause**: The redirect URI in your app registration doesn't match your application URL.

**Solution**:
1. Go to Azure Portal > App registrations > Your app
2. Navigate to Authentication
3. Ensure redirect URIs match your application URLs
4. Platform must be set to "Single-page application (SPA)"

See [Getting Started Guide](GETTING_STARTED.md#step-2-configure-authentication) for details.

#### Error: "AADSTS700051: response_type 'code' is not enabled"
**Cause**: Implicit grant flow not enabled.

**Solution**:
1. Go to Azure Portal > App registrations > Your app > Authentication
2. Under "Implicit grant and hybrid flows", check:
   - ✅ Access tokens
   - ✅ ID tokens
3. Save the configuration

### 3. Environment Variable Issues

#### Warning: "Azure AD Client ID not configured"
**Cause**: Environment variables not loaded properly.

**Solution**:
1. Ensure `.env.local` file exists in the project root
2. Check variable names start with `VITE_`
3. Restart the development server after changes
4. Verify values in browser console

```bash
# Correct format in .env.local
VITE_AZURE_CLIENT_ID=your-client-id-here
VITE_AZURE_AUTHORITY=https://login.microsoftonline.com/your-tenant-id
```

### 4. Authentication Flow Issues

#### Error: Popup blocked or empty popup
**Cause**: Browser blocking popup windows.

**Solution**: The app automatically falls back to redirect authentication if popups are blocked.

#### Error: "User cancelled" or interaction closed
**Cause**: User closed the authentication popup/page.

**Solution**: This is normal behavior. User can try signing in again.

#### Error: "Interaction in progress"
**Cause**: Another authentication request is already running.

**Solution**: Wait for the current authentication to complete, or refresh the page.

### 5. Microsoft Graph API Issues

#### Error: "Graph API call failed: 401"
**Cause**: Token doesn't have permission to access Microsoft Graph.

**Solution**:
1. Check that `User.Read` permission is granted in Azure AD
2. Admin consent may be required for organizational accounts
3. The app gracefully falls back to basic account info if Graph fails

#### Error: "Graph API call failed: 403"
**Cause**: Insufficient permissions or conditional access policy.

**Solution**:
1. Contact your Azure AD administrator
2. Check if additional permissions are needed
3. Review conditional access policies

### 6. Development vs Production Issues

#### Localhost works but production doesn't
**Cause**: Redirect URI not configured for production domain.

**Solution**:
1. Add your production URL to Azure AD app registration
2. Update environment variables for production
3. Ensure HTTPS is used in production

### 7. Debug Mode

Enable verbose logging in browser console:
```javascript
localStorage.setItem('msal.log.level', 'Verbose');
localStorage.setItem('msal.log.pii', 'true');
```

### 8. Quick Validation Checklist

Before reporting issues, verify:

- [ ] Dependencies installed (`@azure/msal-browser`, `@azure/msal-react`)
- [ ] `.env.local` file exists with correct `VITE_` prefixed variables
- [ ] Development server restarted after environment changes
- [ ] Azure AD app registration configured correctly
- [ ] Redirect URIs match exactly (including port number)
- [ ] Browser console shows no import errors
- [ ] Browser doesn't block popups (or redirect fallback works)

### 9. Still Having Issues?

1. **Check the documentation**:
   - [Getting Started Guide](GETTING_STARTED.md) - Complete setup
   - [API Setup Guide](API_SETUP.md) - API configuration
   - [Deployment Guide](DEPLOYMENT.md) - Deployment troubleshooting

2. **Review Azure Portal**:
   - Application logs in Static Web Apps or Function Apps
   - Authentication logs in Azure AD
   - OpenAI metrics and diagnostics

3. **Enable debug logging**:
   ```javascript
   localStorage.setItem('msal.log.level', 'Verbose');
   localStorage.setItem('msal.log.pii', 'true');
   ```

4. **Check browser console** for detailed error messages

---

## API-Specific Issues

### API Returns 500 Error

**Possible causes**:
- Managed Identity not configured
- Missing OpenAI permissions
- Invalid application settings

**Solution**: See [API Setup - Troubleshooting](API_SETUP.md#troubleshooting)

### CORS Errors in Local Development

**Solution**: Ensure `api/local.settings.json` has proper CORS configuration. See [API Setup - Local Development](API_SETUP.md#local-development)

### OpenAI Authentication Failed

**Solution**: Verify Managed Identity and RBAC permissions. See [API Setup - Security Configuration](API_SETUP.md#security-configuration)

---

**Last Updated**: January 2026

1. **Check browser console** for detailed error messages
2. **Review Azure AD app registration** settings
3. **Verify environment variables** are loaded correctly
4. **Test with a simple Microsoft account** (personal account)
5. **Try incognito/private browsing** to rule out cache issues

### 10. Contact Information

If you continue to experience issues:
- Check the Azure AD audit logs in Azure Portal
- Review MSAL.js documentation: https://docs.microsoft.com/en-us/azure/active-directory/develop/msal-js-initializing-client-applications
- File an issue with detailed error logs and configuration (without sensitive data)
