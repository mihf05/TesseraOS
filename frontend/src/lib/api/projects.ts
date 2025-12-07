import { apiClient } from './client';
import { Project, CreateProjectDto, UpdateProjectDto } from '@/types';

export const projectsApi = {
  getAll: (token: string) => apiClient.get<Project[]>('/projects', token),

  getById: (id: string, token: string) =>
    apiClient.get<Project>(`/projects/${id}`, token),

  create: (data: CreateProjectDto, token: string) =>
    apiClient.post<Project>('/projects', data, token),

  update: (id: string, data: UpdateProjectDto, token: string) =>
    apiClient.patch<Project>(`/projects/${id}`, data, token),

  delete: (id: string, token: string) =>
    apiClient.delete(`/projects/${id}`, token),
};
