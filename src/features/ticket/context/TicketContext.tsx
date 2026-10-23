import React, { createContext, useContext, useState, useEffect, useReducer } from 'react';
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
  updateStatus: (ticketId: string) => void;
  updateTicket: (ticketId: string, updateData: Partial<Ticket>) => void;
  deleteTicket: (ticketId: string) => Promise<void>;
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
    
    apiClient.get('product')
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
  const handleAddTicket = (typedTitle: string) => {
    const newTicket = {
      id: Date.now().toString(),
      jobTitle: typedTitle,
      user: "System Admin",
      status: "Open",
      priority: "Medium"
    };
    setTickets((prev : Ticket[]) => [...prev, newTicket]);
  };

  // Action: Update Ticket
  const handleUpdateTicket =  (ticketId: string, updateData: Partial<Ticket>) => {
    try {
      //apiClient.put(`/product/${ticketId}`).then((response) => {
      console.log(`Ticket ${ticketId} updated with data:`, updateData);   
      }
    catch (error) {
      console.error("Error updating ticket:", error);
    }
  }

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
    await apiClient.delete(`/product/${ticketId}`);
  } catch (error) {
   
    alert("Failed to delete. Restoring item.");

    setTickets(originalTickets);
  }
};


  // Action: Update Status
  const handleUpdateStatus = (ticketId : string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: 'Resolved' } : t))
    );
  };

  // Bundle everything together to broadcast to your app
  const value = {
    tickets,
    isLoading: state.isLoading, // Now you can pass loading state to your components!
    error: state.error,         // Now you can pass error state to your components!
    addTicket: handleAddTicket,
    updateStatus: handleUpdateStatus,
    updateTicket: handleUpdateTicket, // Expose update function to child components
    deleteTicket: handleDeleteTicket, // Expose delete function to child components
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
