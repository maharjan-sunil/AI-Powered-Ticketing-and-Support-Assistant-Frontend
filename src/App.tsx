import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MsalAuthenticationTemplate } from '@azure/msal-react';
import { InteractionType } from '@azure/msal-browser';
import { loginRequest } from './config/authConfig'; // Verify your config import path

import DashboardView from './pages/DashboardView';
import TicketDetailView from './pages/TicketDetailView';

import { TicketProvider } from './contexts/TicketContext';
import './App.css';

function Header() {
  return (
    <header className="app-header">
      <h1>🎟️ Ticket Dashboard</h1>
      <p>Real-time job status tracking</p>
    </header>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <TicketProvider>
        
        <MsalAuthenticationTemplate 
          interactionType={InteractionType.Redirect} 
          authenticationRequest={loginRequest}
          loadingComponent={() => <div className="loading-screen">Connecting to Microsoft...</div>}
          errorComponent={({ error }) => <div className="error-screen">Login Error: {error?.message}</div>}
        >
          <div className="app-container">
            <Header />
            
            <Routes>
              {/* Main Dashboard Route */}
              <Route path="/" element={<DashboardView />} />
              
              {/* Dynamic Details Route */}
              <Route path="/ticket/:id" element={<TicketDetailView />} />
              
              {/* Fallback to Dashboard */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </MsalAuthenticationTemplate>
      </TicketProvider>
    </BrowserRouter>
  );
}
