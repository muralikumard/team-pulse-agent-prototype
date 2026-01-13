import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // Use relative paths instead of root relative paths
  server: {
    // Proxy API requests to Azure Functions local runtime during development
    proxy: {
      '/api': {
        target: 'http://localhost:7071',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor libraries into separate chunks
          'vendor-react': ['react', 'react-dom'],
          'vendor-azure-msal': ['@azure/msal-browser', '@azure/msal-react'],
          'vendor-markdown': ['marked']
        }
      }
    },
    chunkSizeWarningLimit: 1000, // Increase limit to 1000 KB (only if needed)
  }
})

