import React, { createContext, useContext, useState, useEffect } from 'react';
import { PublicClientApplication, InteractionType } from '@azure/msal-browser';
import { useMsal, useAccount } from '@azure/msal-react';
import { msalConfig, loginRequest, graphConfig, getAuthErrorMessage } from '../azureAdConfig.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Microsoft Graph API helper function
const callMsGraph = async (accessToken, endpoint) => {
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  };

  try {
    const response = await fetch(endpoint, { headers });
    if (!response.ok) {
      throw new Error(`Graph API call failed: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error calling Microsoft Graph:', error);
    throw error;
  }
};

export const AuthProvider = ({ children }) => {
  const { instance, accounts, inProgress } = useMsal();
  const account = useAccount(accounts[0] || {});
  
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  // Load user profile from Microsoft Graph
  const loadUserProfile = async (accessToken) => {
    try {
      const profile = await callMsGraph(accessToken, graphConfig.graphMeEndpoint);
      return profile;
    } catch (error) {
      console.warn('Could not load user profile from Microsoft Graph:', error);
      return null;
    }
  };

  // Initialize user state when account changes
  useEffect(() => {
    const initializeUser = async () => {
      if (account && accounts.length > 0) {
        setIsLoading(true);
        try {
          // Try to acquire token silently for Microsoft Graph
          const response = await instance.acquireTokenSilent({
            ...loginRequest,
            account: account
          });

          // Load detailed profile from Microsoft Graph
          const profile = await loadUserProfile(response.accessToken);
          
          const userData = {
            id: account.homeAccountId,
            name: account.name || profile?.displayName || 'Unknown User',
            email: account.username || profile?.mail || profile?.userPrincipalName || '',
            avatar: profile?.jobTitle ? '👤' : '�‍💼', // Simple avatar based on job title
            department: profile?.department || 'Unknown Department',
            role: profile?.jobTitle || 'Team Member',
            provider: 'microsoft',
            tenantId: account.tenantId,
            accessToken: response.accessToken,
            graphProfile: profile
          };

          setUser(userData);
          setUserProfile(profile);
          
          // Store user in localStorage for persistence
          localStorage.setItem('authenticated_user', JSON.stringify(userData));
        } catch (error) {
          console.error('Error initializing user:', error);
          setAuthError(getAuthErrorMessage(error));
          
          // Fallback to basic account info if Graph call fails
          const basicUserData = {
            id: account.homeAccountId,
            name: account.name || 'Unknown User',
            email: account.username || '',
            avatar: '�',
            department: 'Unknown Department',
            role: 'Team Member',
            provider: 'microsoft',
            tenantId: account.tenantId
          };
          
          setUser(basicUserData);
          localStorage.setItem('authenticated_user', JSON.stringify(basicUserData));
        } finally {
          setIsLoading(false);
        }
      } else {
        // No account found
        setUser(null);
        setUserProfile(null);
        localStorage.removeItem('authenticated_user');
        setIsLoading(false);
      }
    };

    if (inProgress === InteractionType.None) {
      initializeUser();
    }
  }, [account, accounts, instance, inProgress]);

  const signIn = async () => {
    setIsAuthenticating(true);
    setAuthError(null);
    
    try {
      // Use popup login for better user experience
      const response = await instance.loginPopup(loginRequest);
      console.log('Login successful:', response);
    } catch (error) {
      console.error('Login error:', error);
      setAuthError(getAuthErrorMessage(error));
      
      // If popup is blocked, try redirect
      if (error.errorCode === 'popup_window_error' || error.errorCode === 'empty_window_error') {
        try {
          await instance.loginRedirect(loginRequest);
        } catch (redirectError) {
          console.error('Redirect login error:', redirectError);
          setAuthError(getAuthErrorMessage(redirectError));
        }
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      // Clear local storage
      localStorage.removeItem('authenticated_user');
      localStorage.removeItem('accomplishments');
      
      // Sign out from Azure AD
      await instance.logoutPopup({
        postLogoutRedirectUri: msalConfig.auth.postLogoutRedirectUri,
        mainWindowRedirectUri: msalConfig.auth.postLogoutRedirectUri
      });
    } catch (error) {
      console.error('Logout error:', error);
      // If popup logout fails, try redirect logout
      try {
        await instance.logoutRedirect({
          postLogoutRedirectUri: msalConfig.auth.postLogoutRedirectUri
        });
      } catch (redirectError) {
        console.error('Redirect logout error:', redirectError);
      }
    } finally {
      setUser(null);
      setUserProfile(null);
      setIsLoading(false);
    }
  };

  const value = {
    user,
    userProfile,
    isLoading,
    isAuthenticating,
    authError,
    signIn,
    signOut,
    isAuthenticated: !!user && !!account,
    account,
    instance
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
