import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import { Toaster } from 'react-hot-toast';

import AdminLayout from './components/layout/AdminLayout';
import DashboardView from './features/ticket/pages/DashboardView';
import TicketDetailView from './features/ticket/pages/TicketDetailView';

import { TicketProvider } from './features/ticket/context/TicketContext';

import { useLoadingStore } from './store/loading'; // Adjust path if needed
import './App.css';

export default function App() {

  const isLoading = useLoadingStore((state) => state.isLoading);

  return (
    <BrowserRouter>

      {isLoading && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-[2px] pointer-events-auto">
          {/* Centered Spinner Object */}
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
        </div>
      )}

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
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
    </BrowserRouter>
  );
}
