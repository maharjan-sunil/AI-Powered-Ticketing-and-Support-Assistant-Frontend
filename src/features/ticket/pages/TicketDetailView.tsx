import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import { apiClient } from '../../../api/apiClient';
import TicketForm from '../components/TicketForm';
import { useTickets } from '../context/TicketContext';
import { Ticket } from '../type';

export default function TicketDetailView() {

  const { id } = useParams() as { id: string };
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const { isLoading, error, updateTicketStatus, dispatch } = useTickets();

  // const [isEditing, setIsEditing] = useState(false);
  const [currentTicketStatus, setCurrentTicketStatus] = useState<string>();
  const statusOptions = ['Open', 'In Progress', 'Resolved', 'Closed'];

  useEffect(() => {
    dispatch({ type: 'FETCH_TICKETS' });

    apiClient.get(`ticket/search?ticketId=${id}`)
      .then((response) => {
        setTicket(response.data);
        setCurrentTicketStatus(response.data.status);
        dispatch({ type: 'PROCESSING_COMPLETED' });
      })
      .catch((err) => {
        dispatch({ type: 'FETCH_ERROR', payload: err.message });
      });
  }, [id, dispatch]); // FIXED: Added dispatch dependency to satisfy react-hooks/exhaustive-deps rules

  // FIXED: Explicitly added string typing to standard event input 
  const openForm = (ticketId: string) => {
    setActiveTicketId(ticketId);
  };

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    const newStatusValue = await updateTicketStatus(id, newStatus);
    console.log(`New status value returned from context: ${newStatusValue}`);
    setCurrentTicketStatus(newStatusValue);
    // setIsEditing(false);
  };


  // FIXED: Explicitly added string typing to tracking string argument
  const handleFormSuccess = (updatedTitle: string) => {
    setTicket((prevTicket) => {
      // FIXED: Safeguarded against null to fix target payload mismatch errors
      if (!prevTicket) return null;
      return {
        ...prevTicket,
        description: updatedTitle
      };
    });
    setActiveTicketId(null);
  };

  if (isLoading) return <div>⏳ Loading tickets, please wait...</div>;
  if (error) return <div>❌ Error: {error}</div>;

  if (!ticket) return
  <p>System Profile Error: Target ID {id} not found.
    <Link to="/">Return home</Link></p>;

  return (
    <div>
      {!activeTicketId &&
        <div style={{ background: '#fff', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <Link to="/" style={{ color: '#3498db', textDecoration: 'none' }}>&larr; Back to Dashboard</Link>
          <h2 style={{ marginTop: '15px' }}>Ticket #{ticket.ticketNumber} &nbsp;
            <button onClick={() => { openForm(ticket.id) }} style={{ marginRight: '10px', padding: '6px 12px', background: '#f39c12', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>Edit</button>
          </h2>
          <hr />
          <div style={{ lineHeight: '1.8' }}>
            <p><strong>Message:</strong> {ticket.description}</p>
            <p><strong>Assigned Engineer:</strong> {ticket.user || 'Unassigned'}</p>

            {/* Replaced <p> with <div> to allow nesting, matching line height with leading-loose */}
            <div className="flex items-center gap-2 font-sans leading-loose">
              <strong className="text-sm font-semibold text-gray-600">Status:</strong>

              {/* Relative wrapper keeps the content size locked */}
              <div className="relative inline-block">

                {/* Beautiful Visual Badge */}
                <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-50 px-4 py-1.5 text-sm font-semibold text-cyan-800 shadow-sm">
                  {currentTicketStatus}
                  <span className="ml-0.5 h-0 w-0 border-x-4 border-t-4 border-x-transparent border-t-cyan-800" />
                </span>

                {/* Invisible Native Select layered perfectly on top */}
                <select
                  value={currentTicketStatus}
                  onChange={handleStatusChange}
                  className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
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

            <p><strong>Priority:</strong> {ticket.priority}</p>
            <p><strong>Category:</strong> {ticket.category}</p>
          </div>

        </div>}
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
