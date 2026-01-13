class StorageManager {
  constructor() {
    this.storageType = localStorage.getItem('teampulse_storage_type') || 'localStorage';
    this.sharedFolderPath = localStorage.getItem('teampulse_shared_folder') || '';
    this.isSharedFolderConnected = false;
    this.directoryHandle = null;
  }

  // Initialize with any required setup
  initialize() {
    this.checkSharedFolderConnection();
  }

  // Set storage type
  setStorageType(type) {
    this.storageType = type;
    localStorage.setItem('teampulse_storage_type', type);
  }

  // Set shared folder path
  setSharedFolderPath(path) {
    this.sharedFolderPath = path;
    localStorage.setItem('teampulse_shared_folder', path);
  }

  // Set directory handle
  setDirectoryHandle(handle) {
    this.directoryHandle = handle;
    // Note: We can't store the actual handle in localStorage due to security restrictions
    // We'll store just the folder name for display purposes
    if (handle && handle.name) {
      this.setSharedFolderPath(handle.name);
    }
  }

  // Check if shared folder is accessible
  async checkSharedFolderConnection() {
    if (this.storageType !== 'sharedfolder') {
      return false;
    }

    try {
      // Check if File System Access API is supported
      if (!('showDirectoryPicker' in window)) {
        this.isSharedFolderConnected = false;
        return false;
      }

      // If we have a directory handle, test it
      if (this.directoryHandle) {
        await this.testSharedFolderConnection();
        return this.isSharedFolderConnected;
      }
      
      this.isSharedFolderConnected = false;
      return false;
    } catch (error) {
      console.error('Shared folder connection check failed:', error);
      this.isSharedFolderConnected = false;
      return false;
    }
  }

  // Test shared folder connection
  async testSharedFolderConnection() {
    try {
      if (!('showDirectoryPicker' in window)) {
        throw new Error('File System Access API not supported in this browser');
      }

      if (!this.directoryHandle) {
        throw new Error('No shared folder selected');
      }

      // Try to create a test file
      const testFileName = 'teampulse_test.json';
      const fileHandle = await this.directoryHandle.getFileHandle(testFileName, { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(JSON.stringify({ test: true, timestamp: new Date().toISOString() }));
      await writable.close();
      
      // Clean up test file
      await this.directoryHandle.removeEntry(testFileName);
      
      this.isSharedFolderConnected = true;
      return true;
    } catch (error) {
      console.error('Shared folder connection test failed:', error);
      this.isSharedFolderConnected = false;
      return false;
    }
  }

  // Save accomplishments to localStorage
  async saveToLocalStorage(accomplishments) {
    try {
      localStorage.setItem('teampulse_accomplishments', JSON.stringify(accomplishments));
      return true;
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
      throw error;
    }
  }

  // Load accomplishments from localStorage
  async loadFromLocalStorage() {
    try {
      const data = localStorage.getItem('teampulse_accomplishments');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      return [];
    }
  }

  // Save accomplishments to shared folder
  async saveToSharedFolder(accomplishments) {
    try {
      if (!this.directoryHandle) {
        throw new Error('No shared folder selected');
      }

      const fileName = 'team_accomplishments.json';
      const fileHandle = await this.directoryHandle.getFileHandle(fileName, { create: true });
      const writable = await fileHandle.createWritable();
      
      const data = {
        accomplishments: accomplishments,
        lastUpdated: new Date().toISOString(),
        version: '1.0'
      };
      
      await writable.write(JSON.stringify(data, null, 2));
      await writable.close();
      
      return true;
    } catch (error) {
      console.error('Failed to save to shared folder:', error);
      throw error;
    }
  }

  // Load accomplishments from shared folder
  async loadFromSharedFolder() {
    try {
      if (!this.directoryHandle) {
        throw new Error('No shared folder selected');
      }

      const fileName = 'team_accomplishments.json';
      
      try {
        const fileHandle = await this.directoryHandle.getFileHandle(fileName);
        const file = await fileHandle.getFile();
        const text = await file.text();
        const data = JSON.parse(text);
        
        // Return accomplishments array, handling both old and new format
        return data.accomplishments || data || [];
      } catch (error) {
        if (error.name === 'NotFoundError') {
          // File doesn't exist yet, return empty array
          return [];
        }
        throw error;
      }
    } catch (error) {
      console.error('Failed to load from shared folder:', error);
      return [];
    }
  }

  // Save accomplishments based on current storage type
  async saveAccomplishments(accomplishments, storageType = null, folderPath = null) {
    const targetStorageType = storageType || this.storageType;
    
    try {
      if (targetStorageType === 'sharedfolder') {
        if (folderPath && folderPath !== this.sharedFolderPath) {
          this.setSharedFolderPath(folderPath);
        }
        return await this.saveToSharedFolder(accomplishments);
      } else {
        return await this.saveToLocalStorage(accomplishments);
      }
    } catch (error) {
      console.error('Failed to save accomplishments:', error);
      throw error;
    }
  }

  // Load accomplishments based on storage type
  async loadAccomplishments(storageType = null, folderPath = null) {
    const targetStorageType = storageType || this.storageType;
    
    try {
      if (targetStorageType === 'sharedfolder') {
        if (folderPath && folderPath !== this.sharedFolderPath) {
          this.setSharedFolderPath(folderPath);
        }
        return await this.loadFromSharedFolder();
      } else {
        return await this.loadFromLocalStorage();
      }
    } catch (error) {
      console.error('Failed to load accomplishments:', error);
      return [];
    }
  }

  // Migrate data between storage types
  async migrateData(fromType, toType, fromPath = null, toPath = null) {
    try {
      // Load data from source
      const accomplishments = await this.loadAccomplishments(fromType, fromPath);
      
      // Save data to destination
      await this.saveAccomplishments(accomplishments, toType, toPath);
      
      // Update current storage type
      this.setStorageType(toType);
      if (toType === 'sharedfolder' && toPath) {
        this.setSharedFolderPath(toPath);
      }
      
      return true;
    } catch (error) {
      console.error('Data migration failed:', error);
      throw error;
    }
  }

  // Get storage status
  getStorageStatus() {
    return {
      storageType: this.storageType,
      sharedFolderPath: this.sharedFolderPath,
      isSharedFolderConnected: this.isSharedFolderConnected
    };
  }
}

// Export the class for instantiation
export { StorageManager };