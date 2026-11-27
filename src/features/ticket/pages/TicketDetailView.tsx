import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import TicketForm from '../components/TicketForm';
import {
  useTicketDetailQuery,
  useUpdateTicketStatusMutation,
} from '../hooks/useTicketsQuery';

export default function TicketDetailView() {
  const { id } = useParams() as { id: string };
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);

  const statusOptions = ['Open', 'In Progress', 'Resolved', 'Closed'];

  const { data: ticket, isPending: isLoading, error } = useTicketDetailQuery(id);
  const updateStatusMutation = useUpdateTicketStatusMutation();

  const openForm = (ticketId: string) => {
    setActiveTicketId(ticketId);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;

    if (ticket?.status === newStatus) {
      toast.error('No changes detected. Update aborted.');
      return;
    }

    // Automatically updates both ['tickets'] and ['tickets', 'detail', id] caches
    updateStatusMutation.mutate({ ticketId: id, newStatus });
  };

  // Once TicketForm uses useUpdateTicketMutation, the cache updates automatically—
  // so this callback only needs to close the edit form!
  const handleFormSuccess = () => {
    setActiveTicketId(null);
  };

  if (isLoading) return <div>⏳ Loading tickets, please wait...</div>;
  if (error) return <div>❌ Error: {error.message}</div>;

  if (!ticket) {
    return (
      <p>
        System Profile Error: Target ID {id} not found.{' '}
        <Link to="/">Return home</Link>
      </p>
    );
  }

  return (
    <div>
      {!activeTicketId && (
        <div
          style={{
            background: '#fff',
            padding: '25px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <Link to="/" style={{ color: '#3498db', textDecoration: 'none' }}>
            &larr; Back to Dashboard
          </Link>
          <h2 style={{ marginTop: '15px' }}>
            Ticket #{ticket.ticketNumber} &nbsp;
            <button
              onClick={() => openForm(ticket.id)}
              style={{
                marginRight: '10px',
                padding: '6px 12px',
                background: '#f39c12',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '4px',
              }}
            >
              Edit
            </button>
          </h2>
          <hr />
          <div style={{ lineHeight: '1.8' }}>
            <p>
              <strong>Message:</strong> {ticket.description}
            </p>
            <p>
              <strong>Assigned Engineer:</strong> {ticket.user || 'Unassigned'}
            </p>

            <div className="flex items-center gap-2 font-sans leading-loose">
              <strong className="text-sm font-semibold text-gray-600">
                Status:
              </strong>

              <div className="relative inline-block">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full bg-cyan-50 px-4 py-1.5 text-sm font-semibold text-cyan-800 shadow-sm ${
                    updateStatusMutation.isPending ? 'opacity-60' : ''
                  }`}
                >
                  {ticket.status}
                  <span className="ml-0.5 h-0 w-0 border-x-4 border-t-4 border-x-transparent border-t-cyan-800" />
                </span>

                <select
                  value={ticket.status}
                  onChange={handleStatusChange}
                  disabled={updateStatusMutation.isPending}
                  className="absolute inset-0 w-full h-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
                  title="Click to change status"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <p>
              <strong>Priority:</strong> {ticket.priority}
            </p>
            <p>
              <strong>Category:</strong> {ticket.category}
            </p>
          </div>
        </div>
      )}

      <div>
        {activeTicketId && (
          <TicketForm
            isEditMode={true}
            initialData={ticket}
            onSuccess={handleFormSuccess}
          />
        )}
      </div>
    </div>
  );
}
