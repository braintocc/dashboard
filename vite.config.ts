import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import faroUploader from '@grafana/faro-rollup-plugin';

export default defineConfig({
  plugins: [
    react(),
    faroUploader({
      appName: 'brainto-dashboard',
      endpoint: 'https://faro-api-prod-eu-north-0.grafana.net/faro/api/v1',
      appId: '118',
      stackId: '840374',
      apiKey: 'glc_eyJvIjoiMTAzODEyOSIsIm4iOiJicmFpbnRvLWRhc2hib2FyZC1zb3VyY2VtYXAtdG9rZW4iLCJrIjoiU243TVRIMUozZEE3Sng0VzcwNzgzamRsIiwibSI6eyJyIjoicHJvZC1ldS1ub3J0aC0wIn19',
      gzipContents: true,
    })
  ],
  server: {
      port: 4000,
  },
})
