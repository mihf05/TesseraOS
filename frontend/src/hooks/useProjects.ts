import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { projectsApi } from '@/lib/api';
import { CreateProjectDto, UpdateProjectDto } from '@/types';

export function useProjects() {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsApi.getAll(session?.accessToken!),
    enabled: !!session?.accessToken,
  });
}

export function useProject(id: string) {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ['projects', id],
    queryFn: () => projectsApi.getById(id, session?.accessToken!),
    enabled: !!session?.accessToken && !!id,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: (data: CreateProjectDto) =>
      projectsApi.create(data, session?.accessToken!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProjectDto }) =>
      projectsApi.update(id, data, session?.accessToken!),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects', variables.id] });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: (id: string) => projectsApi.delete(id, session?.accessToken!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}
