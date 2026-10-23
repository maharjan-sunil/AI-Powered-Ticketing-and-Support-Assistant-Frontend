import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient } from '../../../api/apiClient';
import TicketForm from '../components/TicketForm';

import { useTickets } from '../context/TicketContext';
import { Ticket } from '../type';

export default function TicketDetailView() {
  const { id } = useParams<{ id: string }>(); 
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);

  const { isLoading, error, dispatch } = useTickets();

  useEffect(() => {
    dispatch({ type: 'FETCH_TICKETS' });

    apiClient.get(`product/${id}`)
      .then((response) => {
        setTicket(response.data);
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

  // FIXED: Explicitly added string typing to tracking string argument
  const handleFormSuccess = (updatedTitle: string) => {
    setTicket((prevTicket) => {
      // FIXED: Safeguarded against null to fix target payload mismatch errors
      if (!prevTicket) return null; 
      return {
        ...prevTicket, 
        jobTitle: updatedTitle
      };
    });
    setActiveTicketId(null);
  };

  if (isLoading) return <div>⏳ Loading tickets, please wait...</div>;
  if (error) return <div>❌ Error: {error}</div>;

  if (!ticket) return <p>System Profile Error: Target ID {id} not found. <Link to="/">Return home</Link></p>;

  return (
    <div>
      {!activeTicketId &&
        <div style={{ background: '#fff', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <Link to="/" style={{ color: '#3498db', textDecoration: 'none' }}>&larr; Back to Dashboard</Link>
          <h2 style={{ marginTop: '15px' }}>Job Analysis Profile #{id} &nbsp;
            <button onClick={() => { openForm(ticket.id) }} style={{ marginRight: '10px', padding: '6px 12px', background: '#f39c12', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>Edit</button>
          </h2>
          <hr />
          <div style={{ lineHeight: '1.8' }}>
            <p><strong>Job Title:</strong> {ticket.jobTitle}</p>
            <p><strong>Assigned Engineer:</strong> {ticket.user || 'Unassigned'}</p>
            <p><strong>Current Lifecycle State:</strong> <span style={{ padding: '3px 8px', borderRadius: '4px', background: '#e0f7fa' }}>{ticket.status}</span></p>
            <p><strong>Priority Tier:</strong> {ticket.priority}</p>
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
