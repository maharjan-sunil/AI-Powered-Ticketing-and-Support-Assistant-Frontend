import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import { apiClient } from "../../../api/apiClient";
import { PaginatedTicketsResponse, Ticket, TicketListParams } from "../type";

export const ticketKeys = {
  all: ["tickets"] as const,
  lists: () => [...ticketKeys.all, 'list'] as const,
  list: (params: TicketListParams) => [...ticketKeys.lists(), params] as const,
  detail: (id: string) => [...ticketKeys.all, "detail", id] as const,
};

export function useTicketsQuery({page, pageSize}: TicketListParams) {
  return useQuery<PaginatedTicketsResponse>({
    queryKey: ticketKeys.list({ page, pageSize }),
    queryFn: async () => {
      const response = await apiClient.get(
        `ticket?page=${page}&pageSize=${pageSize}`
      );
      return response.data;
    },
    placeholderData: keepPreviousData, //to keep the previous data while fetching new data for the next page
  });
}

export function useTicketDetailQuery(id: string | undefined) {
  return useQuery({
    queryKey: ticketKeys.detail(id || ""),
    queryFn: async (): Promise<Ticket> => {
      const response = await apiClient.get(`ticket/search?ticketId=${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useAddTicketMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (typedTitle: string): Promise<Ticket> => {
      const response = await apiClient.post("ticket/", { ticketMessage: typedTitle });
      return response.data;
    },
    onSuccess: (createdTicket) => {
      console.log(createdTicket);
      if (createdTicket) {
        queryClient.setQueriesData<Ticket[]>(
          { queryKey: ticketKeys.all }, (old) => {
            if (!Array.isArray(old)) return old;
            return [createdTicket, ...old];
          });
      }
      console.log(
    'ALL KEYS IN CACHE:',
    queryClient.getQueryCache().getAll().map((q) => q.queryKey)
  );
      toast.success("Ticket created successfully!");
    },
    onError: () => {
      toast.error("Failed to create ticket.");
    },
  });
}

export function useUpdateTicketMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      ticketId,
      description,
    }: {
      ticketId: string;
      description: string;
    }) => {
      const response = await apiClient.patch("/ticket", {
        ticketId,
        ticketMessage: description,
      });
      return response.data;
    },
    onSuccess: (_, { ticketId, description }) => {
      // Update list cache
      queryClient.setQueryData<Ticket[]>(ticketKeys.all, (old = []) =>
        old.map((t) => (t.id === ticketId ? { ...t, description } : t))
      );
      // Update detail cache
      queryClient.setQueryData<Ticket>(ticketKeys.detail(ticketId), (old) =>
        old ? { ...old, description } : old
      );
      toast.success("Ticket updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update ticket.");
    },
  });
}

export function useDeleteTicketMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ticketId: string) => {
      await apiClient.delete(`/ticket/${ticketId}`);
    },
    // Runs BEFORE the API request fires
    onMutate: async (ticketId) => {
      await queryClient.cancelQueries({ queryKey: ticketKeys.all });

      const previousTickets = queryClient.getQueryData<Ticket[]>(ticketKeys.all);

      // Optimistically remove from UI immediately
      queryClient.setQueryData<Ticket[]>(ticketKeys.all, (old = []) =>
        old.filter((t) => t.id !== ticketId)
      );

      // Returned object becomes `context` in `onError`
      return { previousTickets };
    },
    onSuccess: (_, ticketId) => {
      queryClient.removeQueries({ queryKey: ticketKeys.detail(ticketId) });
      toast.success("Ticket deleted successfully!");
    },
    onError: (_err, _ticketId, context) => {
      // Rollback cache if API fails
      if (context?.previousTickets) {
        queryClient.setQueryData(ticketKeys.all, context.previousTickets);
      }
      toast.error("Failed to delete. Restoring item.");
    },
  });
}

export function useUpdateTicketStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      ticketId,
      newStatus,
    }: {
      ticketId: string;
      newStatus: string;
    }) => {
      await apiClient.patch(
        `/ticket/status?ticketId=${ticketId}&ticketStatus=${newStatus}`
      );
      return newStatus;
    },
    onSuccess: (newStatus, { ticketId }) => {
      // Sync list cache
      queryClient.setQueryData<Ticket[]>(ticketKeys.all, (old = []) =>
        old.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
      );
      // Sync detail cache
      queryClient.setQueryData<Ticket>(ticketKeys.detail(ticketId), (old) =>
        old ? { ...old, status: newStatus } : old
      );
      toast.success("Status updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update ticket.");
    },
  });
}
