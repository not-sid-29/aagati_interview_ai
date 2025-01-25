import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/api/heygen': {
        target: 'https://api.heygen.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/heygen/, ''),
        secure: false,
        headers: {
          'X-Api-Key': '<HEYGEN_API_KEY>',
          'Content-Type': 'application/json'
        },
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, _req, res) => {
            // Add CORS headers
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Api-Key');
          });

          // Handle OPTIONS requests
          proxy.on('proxyRes', (proxyRes, req, res) => {
            if (req.method === 'OPTIONS') {
              proxyRes.statusCode = 200;
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
              res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Api-Key');
            }
          });
        }
      }
    }
  }
})
