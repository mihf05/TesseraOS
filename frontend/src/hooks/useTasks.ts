import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { tasksApi } from '@/lib/api';
import { CreateTaskDto, UpdateTaskDto } from '@/types';

export function useProjectTasks(projectId: string) {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ['tasks', projectId],
    queryFn: () => tasksApi.getByProject(projectId, session?.accessToken!),
    enabled: !!session?.accessToken && !!projectId,
  });
}

export function useTask(id: string) {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ['tasks', 'detail', id],
    queryFn: () => tasksApi.getById(id, session?.accessToken!),
    enabled: !!session?.accessToken && !!id,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: (data: CreateTaskDto) => tasksApi.create(data, session?.accessToken!),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.projectId] });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskDto }) =>
      tasksApi.update(id, data, session?.accessToken!),
    onSuccess: (task) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', task.projectId] });
      queryClient.invalidateQueries({ queryKey: ['tasks', 'detail', task.id] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: (id: string) => tasksApi.delete(id, session?.accessToken!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
