import React, { useState } from 'react';

const AzureAdSetupHelper = ({ onDismiss }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      backgroundColor: '#fef3c7',
      border: '1px solid #f59e0b',
      borderRadius: '8px',
      padding: '15px',
      maxWidth: '350px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      zIndex: 1000
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
        <h4 style={{ margin: 0, color: '#92400e', fontSize: '1rem' }}>
          ⚙️ Azure AD Setup Required
        </h4>
        {onDismiss && (
          <button
            onClick={onDismiss}
            style={{
              background: 'none',
              border: 'none',
              color: '#92400e',
              cursor: 'pointer',
              fontSize: '1.2rem',
              padding: '0',
              lineHeight: 1
            }}
          >
            ×
          </button>
        )}
      </div>
      
      <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#92400e', lineHeight: '1.4' }}>
        Authentication is not configured. To enable sign-in:
      </p>
      
      <button
        onClick={() => setShowDetails(!showDetails)}
        style={{
          backgroundColor: '#f59e0b',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          padding: '6px 12px',
          fontSize: '0.85rem',
          cursor: 'pointer',
          marginBottom: '10px'
        }}
      >
        {showDetails ? 'Hide' : 'Show'} Setup Steps
      </button>
      
      {showDetails && (
        <div style={{ fontSize: '0.8rem', color: '#92400e', lineHeight: '1.5' }}>
          <ol style={{ margin: '0', paddingLeft: '16px' }}>
            <li>Register an app in Azure Active Directory</li>
            <li>Copy the Client ID and Tenant ID</li>
            <li>Update <code>.env.local</code> with your values</li>
            <li>Restart the dev server</li>
          </ol>
          <p style={{ margin: '10px 0 0 0', fontSize: '0.75rem' }}>
            📖 See <strong>AZURE_AD_SETUP.md</strong> for detailed instructions
          </p>
        </div>
      )}
    </div>
  );
};

export default AzureAdSetupHelper;
