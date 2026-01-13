import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { isAzureAdConfigured } from '../azureAdConfig';
import AzureAdSetupHelper from './AzureAdSetupHelper';

const LoginScreen = () => {
  const { signIn, isAuthenticating, authError } = useAuth();
  const [showSetupHelper, setShowSetupHelper] = useState(!isAzureAdConfigured);

  const handleSignIn = () => {
    signIn();
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        maxWidth: '450px',
        width: '100%',
        textAlign: 'center'
      }}>
        {/* Logo and Title */}
        <div style={{ marginBottom: '30px' }}>
          <img 
            src="/Logo.svg" 
            alt="Team Pulse Agent Logo" 
            style={{ height: '60px', marginBottom: '20px' }}
          />
          <h1 style={{ 
            margin: '0 0 10px 0', 
            color: '#2c3e50',
            fontSize: '1.8rem',
            fontWeight: 'bold'
          }}>
            Welcome to Team Pulse Agent
          </h1>
          <p style={{ 
            margin: 0, 
            color: '#6b7280',
            fontSize: '1rem',
            lineHeight: '1.5'
          }}>
            Track team accomplishments and generate summaries for meetings and reviews.
          </p>
        </div>

        {/* Authentication Status */}
        {isAuthenticating ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '15px',
            padding: '20px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #f3f4f6',
              borderTop: '4px solid #3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <p style={{ color: '#6b7280', margin: 0 }}>Signing in with Microsoft...</p>
          </div>
        ) : (
          <>
            {/* Error Message */}
            {authError && (
              <div style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '20px',
                color: '#dc2626'
              }}>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>
                  <strong>Authentication Error:</strong> {authError}
                </p>
              </div>
            )}

            {/* Microsoft Sign-In Button */}
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ 
                margin: '0 0 20px 0', 
                color: '#374151',
                fontSize: '1.2rem',
                fontWeight: '600'
              }}>
                Sign in with your Microsoft account
              </h3>
              
              <button
                onClick={handleSignIn}
                disabled={isAuthenticating || !isAzureAdConfigured}
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  border: '2px solid #0078d4',
                  borderRadius: '8px',
                  backgroundColor: isAzureAdConfigured ? '#0078d4' : '#9ca3af',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: (isAuthenticating || !isAzureAdConfigured) ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  transition: 'all 0.2s ease',
                  outline: 'none',
                  opacity: (isAuthenticating || !isAzureAdConfigured) ? 0.7 : 1
                }}
                onMouseEnter={(e) => {
                  if (!isAuthenticating && isAzureAdConfigured) {
                    e.target.style.backgroundColor = '#106ebe';
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(0, 120, 212, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isAuthenticating && isAzureAdConfigured) {
                    e.target.style.backgroundColor = '#0078d4';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"/>
                </svg>
                {!isAzureAdConfigured ? 'Azure AD Not Configured' : 'Sign in with Microsoft'}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Spinner Animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      
      {/* Setup Helper - only show if Azure AD is not configured */}
      {showSetupHelper && !isAzureAdConfigured && (
        <AzureAdSetupHelper onDismiss={() => setShowSetupHelper(false)} />
      )}
    </div>
  );
};

export default LoginScreen;
