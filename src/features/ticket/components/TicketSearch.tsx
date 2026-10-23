
import { useEffect, useRef } from 'react';

export type StatusFilter = 'All' | 'Open' | 'Resolved';

const FILTERS: StatusFilter[] = ['All', 'Open', 'Resolved'];

type TicketSearchProps = {
  query: string;
  onQueryChange: (value: string) => void;
  status: StatusFilter;
  onStatusChange: (status: StatusFilter) => void;
  counts: Record<StatusFilter, number>;
};

export default function TicketSearch({
  query,
  onQueryChange,
  status,
  onStatusChange,
  counts,
}: TicketSearchProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === 'k'
      ) {
        event.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div className="flex h-full flex-col justify-center gap-3">
      {/* Search */}
      <div className="relative">
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        >
          <circle cx="9" cy="9" r="6" />
          <path d="m14 14 4 4" strokeLinecap="round" />
        </svg>

        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search by title, ticket ID, user or keyword..."
          aria-label="Search tickets"
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-20 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 [&::-webkit-search-cancel-button]:hidden"
        />

        {query ? (
          <button
            type="button"
            onClick={() => {
              onQueryChange('');
              inputRef.current?.focus();
            }}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100"
          >
            Clear
          </button>
        ) : (
          <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-slate-200 bg-slate-50 px-1.5 py-1 text-[11px] font-medium text-slate-400 sm:block">
            Ctrl K
          </kbd>
        )}
      </div>

      {/* Status filters */}
      <div
        className="flex flex-wrap items-center gap-2"
        role="group"
        aria-label="Filter tickets by status"
      >
        {FILTERS.map((filter) => {
          const active = status === filter;

          return (
            <button
              key={filter}
              type="button"
              aria-pressed={active}
              onClick={() => onStatusChange(filter)}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                active
                  ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50'
              }`}
            >
              {filter}
              <span
                className={`rounded-full px-1.5 py-0.5 text-xs ${
                  active
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {counts[filter]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
