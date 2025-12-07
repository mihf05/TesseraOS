import { apiClient } from './client';
import { Task, CreateTaskDto, UpdateTaskDto } from '@/types';

export const tasksApi = {
  getByProject: (projectId: string, token: string) =>
    apiClient.get<Task[]>(`/projects/${projectId}/tasks`, token),

  getById: (id: string, token: string) => apiClient.get<Task>(`/tasks/${id}`, token),

  create: (data: CreateTaskDto, token: string) =>
    apiClient.post<Task>(`/projects/${data.projectId}/tasks`, data, token),

  update: (id: string, data: UpdateTaskDto, token: string) =>
    apiClient.patch<Task>(`/tasks/${id}`, data, token),

  delete: (id: string, token: string) => apiClient.delete(`/tasks/${id}`, token),
};
