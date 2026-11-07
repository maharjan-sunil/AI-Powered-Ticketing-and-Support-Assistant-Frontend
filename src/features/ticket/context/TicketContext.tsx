import React, { createContext, useContext, useState, useEffect, useReducer } from 'react';
import {toast} from 'react-hot-toast';

import { apiClient } from '../../../api/apiClient';

import { Ticket} from '../type';


interface ReducerState {
  isLoading: boolean;
  error: string | null;
}

type ReducerAction =
  | { type: 'FETCH_TICKETS' }
  | { type: 'PROCESSING_COMPLETED' }
  | { type: 'FETCH_ERROR'; payload: string };

interface TicketContextType {
  tickets: Ticket[];
  isLoading: boolean;
  error: string | null;
  addTicket: (typedTitle: string) => void;
  // updateStatus: (ticketId: string) => void;
  updateTicket: (ticketId: string, updateData: Partial<Ticket>) => void;
  deleteTicket: (ticketId: string) => Promise<void>;
  updateTicketStatus: (ticketId: string, newStatus: string) => Promise<string | undefined>;
  dispatch: React.Dispatch<ReducerAction>;
}


const TicketContext = createContext<TicketContextType | undefined>(undefined);


const initialState: ReducerState = {
  isLoading: false,
  error: null
};

const reducer = (state: ReducerState, action: ReducerAction) => {
  switch (action.type) {
    case 'FETCH_TICKETS':
      return { ...state, isLoading: true, error: null };
    case 'PROCESSING_COMPLETED':
      return { ...state, isLoading: false, error: null };
    case 'FETCH_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    default:
      return state;
  }
};

// 3. Create your provider component
export function TicketProvider({ children }: {children: React.ReactNode}) {
  // Keep your tickets useState just like you had it!
  const [tickets, setTickets] = useState<Ticket[]>([]);

  // Set up the useReducer here so 'dispatch' is available above the useEffect
  const [state, dispatch] = useReducer(reducer, initialState);

  // Fetch data on load
  useEffect(() => {
    dispatch({ type: 'FETCH_TICKETS' });

    apiClient.get('ticket')
      .then((response : { data: Ticket[] }) => {
        setTickets(response.data || []);
      })
      .then(() => {
        dispatch({ type: 'PROCESSING_COMPLETED' });
      })
      .catch((error: any) => {
        dispatch({ type: 'FETCH_ERROR', payload: error.message });
      });
  }, []);

  // Action: Add Ticket
  const handleAddTicket = async (typedTitle: string) => {

  const newTicket = {
    ticketMessage: typedTitle
  };

  try {
    const response = await apiClient.post(`ticket/`, newTicket);

    if (response && response.data) {
      setTickets((prev: Ticket[]) => [response.data, ...prev]);
      toast.success("Ticket created successfully!");
    }
  } catch (error) {
    toast.error("Failed to create ticket.");
  }
};


  // Action: Update Ticket
  const handleUpdateTicket = async (ticketId: string, updateData: Partial<Ticket>) => {
    
    //check before sending request
    const ticketDescription = tickets.find((t) => t.id === ticketId)?.description;

    if(ticketDescription === updateData.description) {
      toast.error("No changes detected. Update aborted.");
      return;
    }

    const updateTicket = {
      ticketId: ticketId,
      ticketMessage: updateData.description
    };

    try {
      await apiClient.patch(`/ticket`, updateTicket).then((response) =>{
        if(response.status === 200){
          ticketDescription && setTickets((prev) =>
            prev.map((t) => (t.id === ticketId ? { ...t, description: updateData.description || t.description } : t))
          );
          toast.success("Ticket updated successfully!");
        }
      })
    } catch (error) {
      toast.error("Failed to update ticket.");  
    }
  };


  // Action: Delete Ticket
  const handleDeleteTicket = async (ticketId : string) => {
    const confirmation = window.prompt("Are you sure you want to delete this ticket? Type 'DELETE' to confirm.");
    if (confirmation !== 'DELETE') {
      return;
    }

  const originalTickets = [...tickets];

  // Instantly update the UI
  setTickets((prev) => prev.filter((t) => t.id !== ticketId));

  try {
    await apiClient.delete(`/ticket/${ticketId}`);
    toast.success("Ticket deleted successfully!");
  } catch (error) {
    toast.error("Failed to delete. Restoring item.");
    setTickets(originalTickets);
  }
};


  // Action: Update Status of the Ticket (e.g., mark as Resolved)
  const handleUpdateStatus = async (ticketId: string, newStatus: string) => {
    //check before sending request
    const status = tickets.find((t) => t.id === ticketId)?.status;

    if (status === newStatus) {
      toast.error("No changes detected. Update aborted.");
      return status;
    }

    // const updateTicketStatus = {
    //   ticketId: ticketId,
    //   ticketStatus: newStatus
    // };

    try {
      var response = await apiClient.patch(`/ticket/status?ticketId=${ticketId}&ticketStatus=${newStatus}`);
        if (response.status === 200) {
          setTickets((prev) =>
            prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
          )
          toast.success("Status updated successfully!");
          return newStatus; // Return the new status to update the local state in TicketDetailView
        }
      }
     catch (error) {
      toast.error("Failed to update ticket.");
    }
    return status; // Return the original status if the update fails
  };

  // Bundle everything together to broadcast to your app
  const value = {
    tickets,
    isLoading: state.isLoading, // Now you can pass loading state to your components!
    error: state.error,         // Now you can pass error state to your components!
    addTicket: handleAddTicket,
    // updateStatus: handleUpdateStatus,
    updateTicket: handleUpdateTicket, // Expose update function to child components
    deleteTicket: handleDeleteTicket, // Expose delete function to child components
    updateTicketStatus: handleUpdateStatus, // Expose status update function to child components
    dispatch // Expose dispatch so child components can trigger state changes
  };

  return (
    <TicketContext.Provider value={value}>
      {children}
    </TicketContext.Provider>
  );
}

// 4. Create your helper hook
export function useTickets() {
  const context = useContext(TicketContext);
  if (context === undefined) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  return context;
}
