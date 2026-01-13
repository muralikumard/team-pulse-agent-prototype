import React, { useState, useEffect } from 'react';

const StorageSettings = ({ 
  storageType, 
  onStorageTypeChange, 
  sharedFolderPath, 
  onSharedFolderChange,
  isSharedFolderConnected,
  isLoading,
  onTestConnection,
  onFolderSelect 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [tempFolderPath, setTempFolderPath] = useState(sharedFolderPath);

  const handleStorageTypeChange = (newStorageType) => {
    if (newStorageType === 'sharedfolder' && !isSharedFolderConnected) {
      setIsExpanded(true);
    }
    onStorageTypeChange(newStorageType);
  };

  const handleTestConnection = async () => {
    setIsConnecting(true);
    try {
      await onTestConnection();
    } finally {
      setIsConnecting(false);
    }
  };

  const handleFolderPathSave = () => {
    onSharedFolderChange(tempFolderPath);
  };

  const handleFolderSelect = async () => {
    console.log('handleFolderSelect called');
    console.log('showDirectoryPicker supported:', 'showDirectoryPicker' in window);
    
    try {
      // Use the callback prop if provided, otherwise use local implementation
      if (onFolderSelect) {
        console.log('Using onFolderSelect prop');
        const result = await onFolderSelect();
        console.log('onFolderSelect result:', result);
        if (result && result.name) {
          setTempFolderPath(result.name);
        }
      } else {
        console.log('Using local implementation');
        // Fallback to local implementation
        if ('showDirectoryPicker' in window) {
          const dirHandle = await window.showDirectoryPicker();
          console.log('Directory selected:', dirHandle);
          setTempFolderPath(dirHandle.name);
          onSharedFolderChange(dirHandle.name);
        } else {
          alert('Directory selection is not supported in this browser. Please use a modern browser like Chrome, Edge, or Firefox.');
        }
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Failed to select folder:', error);
        alert('Failed to select folder. Please try again.');
      } else {
        console.log('User cancelled folder selection');
      }
    }
  };

  useEffect(() => {
    setTempFolderPath(sharedFolderPath);
  }, [sharedFolderPath]);

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '16px',
      padding: '24px',
      margin: '24px 0',
      color: 'white',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <div>
          <h3 style={{
            margin: '0 0 8px 0',
            fontSize: '1.3rem',
            fontWeight: '600'
          }}>
            Storage Settings
          </h3>
          <p style={{
            margin: 0,
            opacity: 0.9,
            fontSize: '0.95rem'
          }}>
            Choose where to store your team accomplishments
          </p>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            padding: '8px 12px',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
          onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
        >
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>

      <div style={{
        display: 'flex',
        gap: '16px',
        marginBottom: isExpanded ? '16px' : '0'
      }}>
        {/* Local Storage Option */}
        <div
          style={{
            padding: '16px',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            backgroundColor: storageType === 'localStorage' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.1)',
            border: storageType === 'localStorage' ? '2px solid white' : '1px solid rgba(255, 255, 255, 0.3)',
            flex: 1,
            color: storageType === 'localStorage' ? '#333' : 'white'
          }}
          onClick={() => handleStorageTypeChange('localStorage')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input
              type="radio"
              id="localStorage"
              name="storage"
              value="localStorage"
              checked={storageType === 'localStorage'}
              onChange={() => handleStorageTypeChange('localStorage')}
              style={{ margin: 0 }}
            />
            <div>
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>Local Storage</div>
              <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>Store data in your browser</div>
            </div>
          </div>
        </div>

        {/* Shared Folder Option */}
        <div
          style={{
            padding: '16px',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            backgroundColor: storageType === 'sharedfolder' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.1)',
            border: storageType === 'sharedfolder' ? '2px solid white' : '1px solid rgba(255, 255, 255, 0.3)',
            flex: 1,
            color: storageType === 'sharedfolder' ? '#333' : 'white'
          }}
          onClick={() => handleStorageTypeChange('sharedfolder')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input
              type="radio"
              id="sharedfolder"
              name="storage"
              value="sharedfolder"
              checked={storageType === 'sharedfolder'}
              onChange={() => handleStorageTypeChange('sharedfolder')}
              style={{ margin: 0 }}
            />
            <div>
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>Shared Folder</div>
              <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>Save to a local or network folder</div>
              {isSharedFolderConnected && (
                <div style={{ 
                  fontSize: '0.75rem', 
                  color: storageType === 'sharedfolder' ? '#059669' : '#10b981',
                  marginTop: '4px',
                  fontWeight: '500'
                }}>
                  ✓ Connected
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Shared Folder Configuration */}
      {isExpanded && storageType === 'sharedfolder' && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          padding: '20px',
          marginTop: '16px'
        }}>
          <h4 style={{ margin: '0 0 16px 0', fontSize: '1.1rem' }}>Shared Folder Configuration</h4>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontSize: '0.9rem',
              fontWeight: '500'
            }}>
              Selected Folder:
            </label>
            
            {/* Show browser compatibility warning if needed */}
            {!('showDirectoryPicker' in window) && (
              <div style={{
                marginBottom: '12px',
                padding: '8px 12px',
                backgroundColor: 'rgba(255, 165, 0, 0.1)',
                borderRadius: '6px',
                border: '1px solid rgba(255, 165, 0, 0.3)',
                fontSize: '0.85rem',
                color: '#ff9500'
              }}>
                ⚠️ Your browser doesn't support folder selection. Please use Chrome, Edge, or a recent version of Firefox.
              </div>
            )}
            
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="text"
                value={tempFolderPath || 'No folder selected'}
                readOnly
                placeholder="Select a folder to save accomplishments"
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '0.9rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  color: '#333',
                  cursor: 'not-allowed'
                }}
              />
              <button
                onClick={handleFolderSelect}
                disabled={!('showDirectoryPicker' in window)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: ('showDirectoryPicker' in window) ? '#059669' : 'rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  fontSize: '0.85rem',
                  cursor: ('showDirectoryPicker' in window) ? 'pointer' : 'not-allowed',
                  fontWeight: '500',
                  opacity: ('showDirectoryPicker' in window) ? 1 : 0.5
                }}
              >
                Browse...
              </button>
              {tempFolderPath !== sharedFolderPath && tempFolderPath && (
                <button
                  onClick={handleFolderPathSave}
                  disabled={isLoading}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: '#0284c7',
                    color: 'white',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  {isLoading ? 'Saving...' : 'Save'}
                </button>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              onClick={handleTestConnection}
              disabled={isConnecting || isLoading || !tempFolderPath}
              style={{
                padding: '10px 20px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: tempFolderPath ? '#0284c7' : 'rgba(255, 255, 255, 0.3)',
                color: 'white',
                fontSize: '0.9rem',
                cursor: (isConnecting || isLoading || !tempFolderPath) ? 'not-allowed' : 'pointer',
                fontWeight: '500',
                opacity: (isConnecting || isLoading || !tempFolderPath) ? 0.6 : 1
              }}
            >
              {isConnecting ? 'Testing...' : 'Test Connection'}
            </button>

            <div style={{
              fontSize: '0.85rem',
              opacity: 0.9,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: isSharedFolderConnected ? '#10b981' : '#ef4444'
              }}></div>
              Status: {isSharedFolderConnected ? 'Connected' : 'Not Connected'}
            </div>
          </div>

          <div style={{
            marginTop: '16px',
            padding: '12px',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderRadius: '6px',
            border: '1px solid rgba(59, 130, 246, 0.2)'
          }}>
            <div style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>
              <strong>💡 Note:</strong> Select a folder where you want to save your team accomplishments as JSON files. 
              This can be a local folder or a network shared folder that your team can access.
            </div>
          </div>
        </div>
      )}

      {/* Storage Status */}
      <div style={{
        marginTop: '16px',
        padding: '12px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '6px',
        fontSize: '0.9rem'
      }}>
        <strong>Current Storage:</strong> {storageType === 'localStorage' ? 'Local Storage' : `Shared Folder (${sharedFolderPath || 'None selected'})`}
      </div>
    </div>
  );
};

export default StorageSettings;
