import React from 'react'
import ReactDOM from 'react-dom/client'
import { createRoutesFromChildren, matchRoutes, Routes, useLocation, useNavigationType } from 'react-router-dom';
import { createReactRouterV6Options, FaroErrorBoundary, getWebInstrumentations, initializeFaro, ReactIntegration } from '@grafana/faro-react';
import { TracingInstrumentation } from '@grafana/faro-web-tracing';
import { BrowserRouter } from "react-router-dom";
import { Auth0ProviderWithNavigate } from './components/Auth0ProviderWithNavigate'
import { ThemeProvider, createTheme } from '@mui/material';
import './index.css';
import App from './App.tsx'

initializeFaro({
  url: 'https://faro-collector-prod-eu-north-0.grafana.net/collect/a42425bbe84084add32465ee2a6e95cb',
  app: {
    name: 'brainto-dashboard',
    version: '1.0.0',
    environment: 'production'
  },
  
  instrumentations: [
    ...getWebInstrumentations(),
    new TracingInstrumentation(),
     new ReactIntegration({
      router: createReactRouterV6Options({
        createRoutesFromChildren,
        matchRoutes,
        Routes,
        useLocation,
        useNavigationType,
      }),
    }),
  ],
});

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#7c2e85',
    },
    secondary: {
      main: '#f50057',
    },
  },
});


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Auth0ProviderWithNavigate>
          <FaroErrorBoundary>
            <App />
          </FaroErrorBoundary>
        </Auth0ProviderWithNavigate>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
)
