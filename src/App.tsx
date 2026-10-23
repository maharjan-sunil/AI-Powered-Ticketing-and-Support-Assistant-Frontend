import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import AdminLayout from './components/layout/AdminLayout';
import DashboardView from './features/ticket/pages/DashboardView';
import TicketDetailView from './features/ticket/pages/TicketDetailView';

import { TicketProvider } from './features/ticket/context/TicketContext';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <TicketProvider>
        <Routes>

          <Route element={<AdminLayout />}>
            <Route path="/" element={<DashboardView />} />
            <Route
              path="/ticket/:id"
              element={<TicketDetailView />}
            />
          </Route>
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </TicketProvider>
    </BrowserRouter>
  );
}
