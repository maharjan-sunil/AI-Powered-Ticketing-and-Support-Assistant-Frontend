
import { useMemo, useRef, useState } from 'react';
import { useTickets } from '../context/TicketContext';
import TicketSearch, {
  type StatusFilter,
} from '../components/TicketSearch';

import { useNavigate } from 'react-router-dom';

import TicketForm from '../components/TicketForm';

type DisplayTicket = {
  id: string | number;
  jobTitle?: string;
  user?: string | { name?: string; email?: string };
  status?: string;
  priority?: string;
  category?: string | { name?: string };
  createdAt?: string;
  createdDate?: string;
};

export default function DashboardView() {
  const { tickets, isLoading, error } = useTickets();

  const createTicketRef = useRef<HTMLElement | null>(null);
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<StatusFilter>('All');

  const formInputRef = useRef<HTMLInputElement | null>(null);

  const ticketStats = useMemo(
    () => ({
      total: tickets.length,
      open: tickets.filter((t) => t.status === 'Open').length,
      resolved: tickets.filter((t) => t.status === 'Resolved').length,
    }),
    [tickets]
  );

  const ticketCounts = useMemo(
    () => ({
      All: tickets.length,
      Open: tickets.filter((t) => t.status === 'Open').length,
      Resolved: tickets.filter((t) => t.status === 'Resolved').length,
    }),
    [tickets]
  );

  const filteredTickets = useMemo(() => {
    const searchTerm = query.trim().toLowerCase();

    return tickets.filter((ticket) => {
      const item = ticket as unknown as DisplayTicket;

      const matchesStatus =
        status === 'All' || item.status === status;

      const userText =
        typeof item.user === 'string'
          ? item.user
          : `${item.user?.name ?? ''} ${item.user?.email ?? ''}`;

      const categoryText =
        typeof item.category === 'string'
          ? item.category
          : item.category?.name ?? '';

      const searchableText = [
        item.id,
        item.jobTitle,
        userText,
        item.status,
        item.priority,
        categoryText,
      ]
        .join(' ')
        .toLowerCase();

      return (
        matchesStatus &&
        (!searchTerm || searchableText.includes(searchTerm))
      );
    });
  }, [tickets, query, status]);

  if (isLoading) {
    return (
      <div className="flex min-h-64 items-center justify-center text-slate-500">
        Loading support tickets...
      </div>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700"
      >
        Unable to load tickets: {error}
      </div>
    );
  }

  return (
    <main className="space-y-5">
      {/* Page header */}
      {/* <header>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Overview of your support tickets and system activity
        </p>
      </header> */}

      <TicketForm></TicketForm>


      {/* Search and status filters */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-stretch">
        {/* Search + filters */}
        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm lg:col-span-5">
          <TicketSearch
            query={query}
            onQueryChange={setQuery}
            status={status}
            onStatusChange={setStatus}
            counts={ticketCounts}
          />
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:col-span-7">
          <StatCard
            title="Total Tickets"
            count={ticketStats.total}
            icon="▤"
            iconStyle="bg-blue-100 text-blue-600"
            cardStyle="border-blue-100"
          />

          <StatCard
            title="Open Tickets"
            count={ticketStats.open}
            icon="▰"
            iconStyle="bg-emerald-100 text-emerald-600"
            cardStyle="border-emerald-100"
          />

          <StatCard
            title="Resolved Tickets"
            count={ticketStats.resolved}
            icon="✓"
            iconStyle="bg-violet-100 text-violet-600"
            cardStyle="border-violet-100"
          />
        </div>
      </section>

      {/* Recent tickets table */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 p-5 sm:p-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Recent Support Tickets
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              View and manage the latest submitted tickets.
            </p>
          </div>

          <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
            {filteredTickets.length}{' '}
            {filteredTickets.length === 1 ? 'ticket' : 'tickets'}
          </span>
        </div>

        <div className="overflow-x-auto px-4 pb-4 sm:px-5">
          <table className="w-full min-w-[850px] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-3 py-4">ID</th>
                <th className="px-3 py-4">Title</th>
                <th className="px-3 py-4">User</th>
                <th className="px-3 py-4">Category</th>
                <th className="px-3 py-4">Priority</th>
                <th className="px-3 py-4">Status</th>
                <th className="px-3 py-4">Created At</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredTickets.map((ticket) => {
                const item = ticket as unknown as DisplayTicket;

                const userName =
                  typeof item.user === 'string'
                    ? item.user
                    : item.user?.name ?? 'Unknown user';

                const categoryName =
                  typeof item.category === 'string'
                    ? item.category
                    : item.category?.name ?? 'Uncategorized';

                const priority = item.priority ?? 'Medium';
                const normalizedPriority = priority.toLowerCase();

                const priorityStyle =
                  normalizedPriority === 'high'
                    ? 'bg-red-100 text-red-700'
                    : normalizedPriority === 'low'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700';

                const normalizedStatus =
                  (item.status ?? 'Open').toLowerCase();

                const statusStyle =
                  normalizedStatus === 'resolved'
                    ? 'bg-emerald-100 text-emerald-700'
                    : normalizedStatus === 'inprogress' ||
                      normalizedStatus === 'in progress'
                      ? 'bg-violet-100 text-violet-700'
                      : 'bg-blue-100 text-blue-700';

                const createdAt = item.createdAt ?? item.createdDate;

                return (
                  <tr
                    key={item.id}
                    onClick={() => navigate(`/ticket/${item.id}`)}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="whitespace-nowrap px-3 py-4 font-semibold text-slate-800">
                      #{item.id}
                    </td>

                    <td className="px-3 py-4 font-medium text-slate-800">
                      {item.jobTitle ?? 'Untitled ticket'}
                    </td>

                    <td className="px-3 py-4 text-slate-600">
                      {userName}
                    </td>

                    <td className="px-3 py-4">
                      <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700">
                        {categoryName}
                      </span>
                    </td>

                    <td className="px-3 py-4">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${priorityStyle}`}
                      >
                        {priority}
                      </span>
                    </td>

                    <td className="px-3 py-4">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyle}`}
                      >
                        {item.status ?? 'Open'}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-3 py-4 text-slate-500">
                      {createdAt
                        ? new Date(createdAt).toLocaleDateString()
                        : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredTickets.length === 0 && (
            <div className="py-12 text-center">
              <p className="font-semibold text-slate-800">
                {tickets.length === 0
                  ? 'No support tickets yet'
                  : 'No matching tickets found'}
              </p>
              <p className="mt-2 text-sm text-slate-500">
                {tickets.length === 0
                  ? 'Create a ticket to get started.'
                  : 'Try another search term or status filter.'}
              </p>

              {tickets.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setStatus('All');
                  }}
                  className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

type StatCardProps = {
  title: string;
  count: number;
  icon: string;
  iconStyle: string;
  cardStyle: string;
};

function StatCard({
  title,
  count,
  icon,
  iconStyle,
  cardStyle,
}: StatCardProps) {
  return (
    <article
      className={`rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md ${cardStyle}`}
    >
      <div className="flex items-center gap-4">
        <span
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-2xl font-bold ${iconStyle}`}
        >
          {icon}
        </span>

        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>
          <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            {count}
          </p>
        </div>
      </div>
    </article>
  );
}
