
import { Link } from 'react-router-dom';
import { TicketCardProps } from '../type';

export default function TicketCard({
  ticket,
  onUpdateStatus,
  onDeleteTicket,
}: TicketCardProps) {
  const { id, jobTitle, user, status, priority } = ticket;

  const priorityStyles: Record<string, string> = {
    High: 'bg-red-50 text-red-700 ring-red-200',
    Medium: 'bg-amber-50 text-amber-700 ring-amber-200',
    Low: 'bg-green-50 text-green-700 ring-green-200',
  };

  const statusStyles: Record<string, string> = {
    Open: 'bg-blue-50 text-blue-700 ring-blue-200',
    'In Progress': 'bg-amber-50 text-amber-700 ring-amber-200',
    Resolved: 'bg-green-50 text-green-700 ring-green-200',
  };

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      {/* Ticket title and priority */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <Link
            to={`/ticket/${id}`}
            className="text-base font-semibold text-slate-800 transition hover:text-blue-600"
          >
            {jobTitle}
          </Link>

          <p className="mt-2 text-sm text-slate-500">
            Ticket ID: <span className="font-medium text-slate-700">{id}</span>
          </p>
        </div>

        <span
          className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
            priorityStyles[priority] ?? 'bg-slate-100 text-slate-700 ring-slate-200'
          }`}
        >
          {priority} Priority
        </span>
      </div>

      {/* Ticket details */}
      <div className="mt-5 grid grid-cols-1 gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Assigned to
          </p>
          <p className="mt-1 text-sm font-medium text-slate-700">
            {user || 'Unassigned'}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Status
          </p>
          <span
            className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
              statusStyles[status] ?? 'bg-slate-100 text-slate-700 ring-slate-200'
            }`}
          >
            {status}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <Link
          to={`/ticket/${id}`}
          className="text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          View details →
        </Link>

        <div className="flex gap-2">
          {status !== 'Resolved' && (
            <button
              type="button"
              onClick={() => onUpdateStatus(id)}
              className="rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Resolve
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              if (window.confirm(`Are you sure you want to delete "${jobTitle}"?`)) {
                onDeleteTicket(id);
              }
            }}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
