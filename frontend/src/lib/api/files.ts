import { apiClient } from './client';
import { File } from '@/types';

export const filesApi = {
  getByProject: (projectId: string, token: string) =>
    apiClient.get<File[]>(`/projects/${projectId}/files`, token),

  getAll: (token: string) => apiClient.get<File[]>('/files', token),

  getDownloadUrl: (id: string, token: string) =>
    apiClient.get<{ url: string }>(`/files/${id}/download`, token),

  delete: (id: string, token: string) => apiClient.delete(`/files/${id}`, token),
};
