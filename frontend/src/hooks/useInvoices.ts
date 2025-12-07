import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { invoicesApi } from '@/lib/api';
import { CreateInvoiceDto } from '@/types';

export function useInvoices() {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ['invoices'],
    queryFn: () => invoicesApi.getAll(session?.accessToken!),
    enabled: !!session?.accessToken,
  });
}

export function useInvoice(id: string) {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ['invoices', id],
    queryFn: () => invoicesApi.getById(id, session?.accessToken!),
    enabled: !!session?.accessToken && !!id,
  });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: (data: CreateInvoiceDto) =>
      invoicesApi.create(data, session?.accessToken!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
}

export function useUpdateInvoice() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateInvoiceDto> }) =>
      invoicesApi.update(id, data, session?.accessToken!),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoices', variables.id] });
    },
  });
}

export function useMarkInvoiceAsPaid() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: (id: string) => invoicesApi.markAsPaid(id, session?.accessToken!),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoices', id] });
    },
  });
}

export function useDeleteInvoice() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: (id: string) => invoicesApi.delete(id, session?.accessToken!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
}
