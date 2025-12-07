import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { clientsApi } from '@/lib/api';
import { CreateClientDto } from '@/types';

export function useClients() {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ['clients'],
    queryFn: () => clientsApi.getAll(session?.accessToken!),
    enabled: !!session?.accessToken,
  });
}

export function useClient(id: string) {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ['clients', id],
    queryFn: () => clientsApi.getById(id, session?.accessToken!),
    enabled: !!session?.accessToken && !!id,
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: (data: CreateClientDto) =>
      clientsApi.create(data, session?.accessToken!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateClientDto> }) =>
      clientsApi.update(id, data, session?.accessToken!),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['clients', variables.id] });
    },
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: (id: string) => clientsApi.delete(id, session?.accessToken!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}
