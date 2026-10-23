type SidebarProps = {
  activePage: string;
  onNavigate: (page: string) => void;
};

const navigationItems = [
  { label: 'Dashboard', icon: '⌂' },
  // { label: 'Tickets', icon: '▤' },
  // { label: 'Categories', icon: '◇' },
  // { label: 'Settings', icon: '⚙' },
];

export default function Sidebar({
  activePage,
  onNavigate,
}: SidebarProps) {
  return (
    <aside className="flex min-h-screen w-[250px] shrink-0 flex-col bg-[#14233f] px-3.5 py-6 text-white">
      {/* Brand */}
      <div className="mb-10 flex items-center gap-3 px-2">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-600 text-2xl">
          ✚
        </div>

        <div>
          <h2 className="whitespace-nowrap text-[17px] font-bold">
            SupportDesk
          </h2>
          <p className="mt-1 text-sm text-slate-300">
            Admin Portal
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2">
        {navigationItems.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => onNavigate(item.label)}
            className={`flex w-full items-center gap-3.5 rounded-lg px-4 py-3.5 text-left text-sm transition-colors ${
              activePage === item.label
                ? 'bg-blue-700 text-white'
                : 'text-slate-200 hover:bg-slate-700'
            }`}
          >
            <span className="w-6 text-center text-xl">
              {item.icon}
            </span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="mt-auto flex items-center gap-2 px-2 pt-8 text-xs text-slate-300">
        <span className="text-xl text-blue-400">▦</span>
        <span>Signed in with Microsoft</span>
      </div>
    </aside>
  );
}