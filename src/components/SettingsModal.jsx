import React from 'react';
import Modal from './Modal';
import StorageSettings from './StorageSettings';

const SettingsModal = ({ 
  isOpen, 
  onClose,
  storageType,
  sharedFolderPath,
  isSharedFolderConnected,
  isLoading,
  onStorageTypeChange,
  onSharedFolderChange,
  onFolderSelect,
  onTestConnection
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Application Settings"
      size="large"
    >
      <div style={{
        padding: '20px 0'
      }}>
        <StorageSettings
          storageType={storageType}
          sharedFolderPath={sharedFolderPath}
          isSharedFolderConnected={isSharedFolderConnected}
          isLoading={isLoading}
          onStorageTypeChange={onStorageTypeChange}
          onSharedFolderChange={onSharedFolderChange}
          onFolderSelect={onFolderSelect}
          onTestConnection={onTestConnection}
        />
        
        {/* Future settings sections can be added here */}
        <div style={{
          marginTop: '32px',
          padding: '20px',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{
            margin: '0 0 12px 0',
            fontSize: '1.1rem',
            fontWeight: '600',
            color: '#374151',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>💡</span>
            Additional Settings
          </h3>
          <p style={{
            margin: 0,
            fontSize: '0.9rem',
            color: '#6b7280',
            lineHeight: '1.5'
          }}>
            More configuration options will be available here in future updates. 
            Currently, you can manage your data storage preferences above.
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default SettingsModal;
