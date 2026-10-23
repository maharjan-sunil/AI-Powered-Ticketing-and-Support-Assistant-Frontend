import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const activePage = location.pathname.startsWith('/tickets')
    ? 'Tickets'
    : location.pathname.startsWith('/categories')
      ? 'Categories'
      : location.pathname.startsWith('/settings')
        ? 'Settings'
        : 'Dashboard';

  const handleNavigate = (page: string) => {
    const routes: Record<string, string> = {
      Dashboard: '/',
      Tickets: '/tickets',
      Categories: '/categories',
      Settings: '/settings',
    };

    navigate(routes[page] ?? '/');
  };

  return (
    <div className="flex min-h-screen w-fullbg-slate-50">
      <Sidebar
        activePage={activePage}
        onNavigate={handleNavigate}
      />

      <div className="min-w-0 flex-1">
        <header className="flex h-[72px] items-center justify-between border-b border-slate-200 bg-white px-6">
          <h1 className="text-lg font-semibold text-slate-800">
            {activePage}
          </h1>

          <span className="text-sm text-slate-500">
            Admin Portal
          </span>
        </header>

        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
