import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from '@azure/msal-react'
import { msalConfig } from './config/authConfig';


const msalInstance = new PublicClientApplication(msalConfig);
const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Failed to find the root element')
}

createRoot(rootElement).render(
  <StrictMode>
    {/* Wrap your entire App with MsalProvider */}
    <MsalProvider instance={msalInstance}>
      <App />
    </MsalProvider>
  </StrictMode>,
)