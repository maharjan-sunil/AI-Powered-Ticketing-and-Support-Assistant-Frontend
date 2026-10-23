export interface Ticket {
  id: string;
  jobTitle: string;
  user: string;
  status: 'Open' | 'In Progress' |'Resolved' | 'Closed' | string;
  priority: 'Low' | 'Medium' | 'High' | string;
}

export interface TicketFormData {
  jobTitle: string;
  user: string;
  status: 'Open' | 'In Progress' |'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High';
}

export interface TicketFormProps {
  inputRef?: React.RefObject<HTMLInputElement | null>;
  isEditMode?: boolean;
  initialData?: Ticket | null; 
  onSuccess?: (updatedTitle: string) => void;
}

export interface TicketCardProps {
  ticket: Ticket;
  onUpdateStatus: (id: string) => void;
  onDeleteTicket: (id: string) => void;
}